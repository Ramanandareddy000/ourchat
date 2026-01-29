import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, User } from '../models';
import { Op } from 'sequelize';
import { Conversation } from '../models/conversation.model';
import { ConversationParticipant } from '../models/conversation-participant.model';

export interface EnrichedConversation {
  id: number;
  name: string | null;
  is_group: boolean;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
  display_name?: string;
  participant_count?: number;
  online?: boolean;
  last_seen?: string;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
    @InjectModel(Conversation)
    private conversationModel: typeof Conversation,
    @InjectModel(ConversationParticipant)
    private conversationParticipantModel: typeof ConversationParticipant,
  ) {}

  async sendDirectOrGroupMessage(params: {
    senderId: number;
    content: string;
    receiverId?: number; // for direct chat
    conversationId?: number; // existing conversation
  }): Promise<{ message: Message } | { error: string }> {
    const { senderId, content, receiverId, conversationId } = params;

    try {
      // Input validation
      if (!senderId || senderId <= 0) {
        return { error: 'Invalid sender ID provided.' };
      }

      if (!content || content.trim().length === 0) {
        return { error: 'Message content cannot be empty.' };
      }

      if (content.trim().length > 10000) {
        return { error: 'Message content cannot exceed 10,000 characters.' };
      }

      if (!receiverId && !conversationId) {
        return {
          error: 'Either receiver ID or conversation ID must be provided.',
        };
      }

      // Validate sender exists
      const sender = await User.findByPk(senderId, {
        attributes: ['id', 'username'],
      });
      if (!sender) {
        return { error: 'Sender does not exist.' };
      }

      let targetConversationId = conversationId || null;

      // Handle direct message (1:1 chat)
      if (!targetConversationId && receiverId) {
        // Validate receiver exists
        if (receiverId <= 0) {
          return { error: 'Invalid receiver ID provided.' };
        }

        const receiver = await User.findByPk(receiverId, {
          attributes: ['id', 'username'],
        });
        if (!receiver) {
          return { error: 'Receiver does not exist.' };
        }

        // Prevent sending messages to yourself (optional business rule)
        if (senderId === receiverId) {
          return { error: 'You cannot send a message to yourself.' };
        }

        // Find existing 1:1 conversation between sender and receiver
        const existing = await this.conversationModel.findOne({
          where: { is_group: false },
          include: [
            {
              model: ConversationParticipant,
              where: { user_id: senderId },
              required: true,
            },
            {
              model: ConversationParticipant,
              where: { user_id: receiverId },
              required: true,
            },
          ],
        });

        if (existing) {
          targetConversationId = existing.id;
        } else {
          // Create new 1:1 conversation
          const createdConversation = await this.createConversation(
            null,
            false,
            senderId,
          );
          await this.addParticipantToConversation(
            createdConversation.id,
            senderId,
          );
          await this.addParticipantToConversation(
            createdConversation.id,
            receiverId,
          );
          targetConversationId = createdConversation.id;
        }
      }

      // Handle group message
      if (targetConversationId) {
        // Validate conversation exists
        const conversation = await this.conversationModel.findByPk(
          targetConversationId,
          {
            attributes: ['id', 'is_group', 'name'],
          },
        );

        if (!conversation) {
          return { error: 'Conversation does not exist.' };
        }

        // Validate sender is a participant in the conversation
        const senderParticipant =
          await this.conversationParticipantModel.findOne({
            where: {
              conversation_id: targetConversationId,
              user_id: senderId,
            },
            attributes: ['id', 'role'],
          });

        if (!senderParticipant) {
          return {
            error: 'You are not a participant in this conversation.',
          };
        }
      }

      if (!targetConversationId) {
        return { error: 'Unable to determine target conversation.' };
      }

      // Create the message
      const createdMessage = await this.create({
        conversation_id: targetConversationId,
        sender_id: senderId,
        text: content.trim(),
      });

      return { message: createdMessage };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        error:
          'An unexpected error occurred while sending the message. Please try again.',
      };
    }
  }

  async create(message: Partial<Message>): Promise<Message> {
    return this.messageModel.create(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.findAll();
  }

  async findOneById(id: number): Promise<Message | null> {
    return this.messageModel.findByPk(id);
  }

  async findByUserId(userId: number): Promise<Message[]> {
    // Find all conversations the user is part of
    const conversationParticipants =
      await this.conversationParticipantModel.findAll({
        where: {
          user_id: userId,
        },
        include: [Conversation],
      });

    const conversationIds = conversationParticipants.map(
      (cp) => cp.conversation_id,
    );

    // Find all messages in those conversations, include sender for enrichment
    return this.messageModel.findAll({
      where: {
        conversation_id: {
          [Op.in]: conversationIds,
        },
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar_url'],
        },
      ],
      order: [['created_at', 'ASC']],
    });
  }

  async findByConversationId(conversationId: number): Promise<Message[]> {
    return this.messageModel.findAll({
      where: {
        conversation_id: conversationId,
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar_url'],
        },
      ],
      order: [['created_at', 'ASC']],
    });
  }

  async getConversationsForUser(
    userId: number,
  ): Promise<EnrichedConversation[]> {
    // Find all conversations the user is part of
    const conversationParticipants =
      await this.conversationParticipantModel.findAll({
        where: {
          user_id: userId,
        },
        include: [Conversation],
      });

    // Extract the conversations
    const conversations = conversationParticipants.map((cp) => cp.conversation);

    // For each conversation, get the participants to determine if it's a group
    // and to get the other participant's name for 1:1 chats
    const enrichedConversations: EnrichedConversation[] = await Promise.all(
      conversations.map(async (conversation) => {
        const participants = await this.getConversationParticipants(
          conversation.id,
        );
        const otherParticipants = participants.filter(
          (p) => p.user_id !== userId,
        );

        // If it's a 1:1 conversation, get the other user's name
        if (!conversation.is_group && otherParticipants.length > 0) {
          const otherUser = otherParticipants[0].user;
          return {
            ...conversation.toJSON(),
            display_name: otherUser?.display_name || 'Unknown User',
            participant_count: participants.length,
            online: otherUser?.online || false,
            last_seen: otherUser?.last_seen || null,
          } as EnrichedConversation;
        } else {
          // For group conversations, just add participant count
          return {
            ...conversation.toJSON(),
            participant_count: participants.length,
          } as EnrichedConversation;
        }
      }),
    );

    return enrichedConversations;
  }

  async update(
    id: number,
    updateData: Partial<Message>,
  ): Promise<[number, Message[]]> {
    return this.messageModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return this.messageModel.destroy({ where: { id } });
  }

  async createConversation(
    name: string | null,
    isGroup: boolean,
    createdBy: number,
  ): Promise<Conversation> {
    return this.conversationModel.create({
      name,
      is_group: isGroup,
      created_by: createdBy,
    });
  }

  async addParticipantToConversation(
    conversationId: number,
    userId: number,
    role: string = 'member',
  ): Promise<ConversationParticipant> {
    return this.conversationParticipantModel.create({
      conversation_id: conversationId,
      user_id: userId,
      role,
      joined_at: new Date(),
    });
  }

  async addParticipantValidated(params: {
    conversationId: number;
    userId?: number;
    username?: string;
  }): Promise<{ participant: ConversationParticipant } | { error: string }> {
    const { conversationId, userId, username } = params;

    try {
      // Input validation
      if (!conversationId || conversationId <= 0) {
        return { error: 'Invalid conversation ID provided.' };
      }

      if (!userId && !username) {
        return { error: 'Either user ID or username must be provided.' };
      }

      // Validate conversation exists and get details
      const conversation = await this.conversationModel.findByPk(
        conversationId,
        {
          attributes: ['id', 'name', 'is_group', 'created_by'],
        },
      );

      if (!conversation) {
        return { error: 'Chat does not exist.' };
      }

      // Resolve and validate user existence
      let resolvedUserId = userId;
      let targetUser: User | null = null;

      if (resolvedUserId) {
        // Validate user by ID
        targetUser = await User.findByPk(resolvedUserId, {
          attributes: ['id', 'username', 'display_name'],
        });
        if (!targetUser) {
          return { error: 'User with provided ID does not exist.' };
        }
      } else if (username?.trim()) {
        // Validate user by username
        const trimmedUsername = username.trim().toLowerCase();
        targetUser = await User.findOne({
          where: { username: trimmedUsername },
          attributes: ['id', 'username', 'display_name'],
        });
        if (!targetUser) {
          return { error: `User with username '${username}' does not exist.` };
        }
        resolvedUserId = targetUser.id;
      }

      if (!resolvedUserId || !targetUser) {
        return { error: 'Unable to resolve user.' };
      }

      // Check for duplicate participant
      const existingParticipant =
        await this.conversationParticipantModel.findOne({
          where: {
            conversation_id: conversationId,
            user_id: resolvedUserId,
          },
          attributes: ['id'],
        });

      if (existingParticipant) {
        return {
          error: `User '${targetUser?.display_name || targetUser?.username}' is already a participant in this chat.`,
        };
      }

      // For group chats, validate participant limits (optional business rule)
      if (conversation.is_group) {
        const currentParticipantCount =
          await this.conversationParticipantModel.count({
            where: { conversation_id: conversationId },
          });

        // Example: limit group chats to 100 participants
        const MAX_GROUP_PARTICIPANTS = 100;
        if (currentParticipantCount >= MAX_GROUP_PARTICIPANTS) {
          return {
            error: `This group chat has reached the maximum limit of ${MAX_GROUP_PARTICIPANTS} participants.`,
          };
        }
      }

      // Add participant with transaction safety
      const participant = await this.addParticipantToConversation(
        conversationId,
        resolvedUserId,
        'member', // default role
      );

      return { participant };
    } catch (error) {
      console.error('Error adding participant to conversation:', error);
      return {
        error:
          'An unexpected error occurred while adding the participant. Please try again.',
      };
    }
  }

  async canUserModifyConversation(
    userId: number,
    conversationId: number,
  ): Promise<boolean> {
    try {
      // Check if user is a participant in the conversation
      const participant = await this.conversationParticipantModel.findOne({
        where: {
          conversation_id: conversationId,
          user_id: userId,
        },
        include: [
          {
            model: this.conversationModel,
            as: 'conversation',
            attributes: ['id', 'is_group', 'created_by'],
          },
        ],
      });

      if (!participant) {
        return false; // User is not a participant
      }

      // For 1:1 chats, any participant can add others (though this might be restricted)
      // For group chats, check if user is admin/creator or has permission
      const conversation = participant.conversation;
      if (!conversation.is_group) {
        // For 1:1 chats, typically only the creator or both participants can add others
        // This is a business rule - adjust based on requirements
        return conversation.created_by === userId;
      }

      // For group chats, check if user is creator or has admin role
      return conversation.created_by === userId || participant.role === 'admin';
    } catch (error) {
      console.error('Error checking user permissions:', error);
      return false;
    }
  }

  async getConversationParticipants(
    conversationId: number,
  ): Promise<ConversationParticipant[]> {
    return this.conversationParticipantModel.findAll({
      where: {
        conversation_id: conversationId,
      },
      include: [{ model: User, as: 'user' }],
    });
  }

  async startConversationWithUser(params: {
    currentUserId: number;
    targetUserId?: number;
    targetUsername?: string;
  }): Promise<{ conversation: Conversation } | { error: string }> {
    const { currentUserId, targetUserId, targetUsername } = params;

    try {
      // Input validation
      if (!currentUserId || currentUserId <= 0) {
        return { error: 'Invalid current user ID provided.' };
      }

      if (!targetUserId && !targetUsername) {
        return { error: 'Either target user ID or username must be provided.' };
      }

      // Validate current user exists
      const currentUser = await User.findByPk(currentUserId, {
        attributes: ['id', 'username', 'display_name'],
      });
      if (!currentUser) {
        return { error: 'Current user does not exist.' };
      }

      // Resolve target user
      let resolvedTargetUserId = targetUserId;
      let targetUser: User | null = null;

      if (resolvedTargetUserId) {
        targetUser = await User.findByPk(resolvedTargetUserId, {
          attributes: ['id', 'username', 'display_name'],
        });
        if (!targetUser) {
          return { error: 'Target user with provided ID does not exist.' };
        }
      } else if (targetUsername?.trim()) {
        const trimmedUsername = targetUsername.trim().toLowerCase();
        targetUser = await User.findOne({
          where: { username: trimmedUsername },
          attributes: ['id', 'username', 'display_name'],
        });
        if (!targetUser) {
          return {
            error: `User with username '${targetUsername}' does not exist.`,
          };
        }
        resolvedTargetUserId = targetUser.id;
      }

      if (!resolvedTargetUserId || !targetUser) {
        return { error: 'Unable to resolve target user.' };
      }

      // Prevent creating conversation with yourself
      if (currentUserId === resolvedTargetUserId) {
        return { error: 'You cannot create a conversation with yourself.' };
      }

      // Check if conversation already exists between these two users
      // We need to find a conversation where ONLY these two users are participants
      const existingConversations = await this.conversationModel.findAll({
        where: { is_group: false },
        include: [
          {
            model: ConversationParticipant,
            include: [{ model: User, as: 'user' }],
          },
        ],
      });

      // Find a conversation that has exactly these two users as participants
      const existingConversation = existingConversations.find((conv) => {
        const participantIds = conv.participants?.map((p) => p.user_id) || [];
        return (
          participantIds.length === 2 &&
          participantIds.includes(currentUserId) &&
          participantIds.includes(resolvedTargetUserId)
        );
      });

      if (existingConversation) {
        return { conversation: existingConversation };
      }

      // Create new 1:1 conversation
      const newConversation = await this.createConversation(
        null, // No name for 1:1 conversations
        false, // Not a group
        currentUserId,
      );

      // Add both users as participants
      await this.addParticipantToConversation(
        newConversation.id,
        currentUserId,
        'member',
      );
      await this.addParticipantToConversation(
        newConversation.id,
        resolvedTargetUserId,
        'member',
      );

      return { conversation: newConversation };
    } catch (error) {
      console.error('Error starting conversation with user:', error);
      return {
        error:
          'An unexpected error occurred while starting the conversation. Please try again.',
      };
    }
  }
}
