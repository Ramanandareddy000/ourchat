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
  participants?: User[];
  participant_count?: number;
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

    // Find all messages in those conversations
    return this.messageModel.findAll({
      where: {
        conversation_id: {
          [Op.in]: conversationIds,
        },
      },
      order: [['created_at', 'ASC']],
    });
  }

  async findByConversationId(conversationId: number): Promise<Message[]> {
    return this.messageModel.findAll({
      where: {
        conversation_id: conversationId,
      },
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
            participants: participants.map((p) => p.user),
            participant_count: participants.length,
          } as EnrichedConversation;
        } else {
          // For group conversations, just add participant info
          return {
            ...conversation.toJSON(),
            participants: participants.map((p) => p.user),
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
}
