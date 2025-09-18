import { NestFactory } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { User, Message, Conversation, ConversationParticipant } from './models';
import { AppModule } from './app.module';

// Define interfaces for the seed data
interface ImportedUser {
  id: number;
  name: string;
  avatar: string;
  image?: string;
  online: boolean;
  lastSeen: string;
  phone?: string;
  about?: string;
  isGroup?: boolean;
}

interface ImportedMessage {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  sender?: string;
}

interface UserData {
  users: ImportedUser[];
  groups: ImportedUser[];
  messages: Record<number, ImportedMessage[]>;
}

// Seed data
const userData: UserData = {
  users: [
    {
      id: 1,
      name: 'Alice Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      online: true,
      lastSeen: 'online',
      phone: '+1 (555) 123-4567',
      about: '',
    },
    {
      id: 2,
      name: 'Bob Smith',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      online: false,
      lastSeen: 'last seen 2 hours ago',
      phone: '+1 (555) 234-5678',
      about: '',
    },
    {
      id: 3,
      name: 'Carol Davis',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      online: true,
      lastSeen: 'online',
      phone: '+1 (555) 345-6789',
      about: '',
    },
    {
      id: 4,
      name: 'David Wilson',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      online: false,
      lastSeen: 'last seen yesterday',
      phone: '+1 (555) 456-7890',
      about: '',
    },
    {
      id: 5,
      name: 'Emma Brown',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      online: true,
      lastSeen: 'online',
      phone: '+1 (555) 567-8901',
      about: '',
    },
    {
      id: 6,
      name: 'Frank Miller',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      online: false,
      lastSeen: 'last seen 5 minutes ago',
      phone: '+1 (555) 678-9012',
      about: '',
    },
  ],
  groups: [
    {
      id: 101,
      name: 'Team Alpha',
      avatar: 'TA',
      online: true,
      lastSeen: '5 members',
      phone: '',
      about: '',
      isGroup: true,
    },
    {
      id: 102,
      name: 'Project Beta',
      avatar: 'PB',
      online: true,
      lastSeen: '8 members',
      phone: '',
      about: '',
      isGroup: true,
    },
  ],
  messages: {
    '1': [
      { id: 1, text: "Hey! How's your day going?", time: '10:30', isMe: false },
      {
        id: 2,
        text: 'Pretty good! Just finished a meeting. How about you?',
        time: '10:31',
        isMe: true,
      },
      {
        id: 3,
        text: 'Same here! Want to grab lunch later?',
        time: '10:32',
        isMe: false,
      },
      {
        id: 4,
        text: 'Sounds great! How about 1 PM?',
        time: '10:33',
        isMe: false,
      },
      { id: 5, text: 'Perfect! See you then 😊', time: '10:34', isMe: false },
    ],
    '2': [
      {
        id: 1,
        text: "Don't forget about the team meeting at 3pm",
        time: '9:15',
        isMe: false,
      },
      {
        id: 2,
        text: "Thanks for the reminder! I'll be there",
        time: '9:16',
        isMe: true,
      },
      {
        id: 3,
        text: "Great! I'll send the agenda in a few minutes",
        time: '9:17',
        isMe: false,
      },
      {
        id: 4,
        text: 'Awesome, looking forward to it',
        time: '9:18',
        isMe: true,
      },
    ],
    '3': [
      {
        id: 1,
        text: 'Good morning! Hope you have a wonderful day',
        time: '8:00',
        isMe: false,
      },
      {
        id: 2,
        text: 'Good morning Carol! Thank you, you too! ☀️',
        time: '8:01',
        isMe: true,
      },
      { id: 3, text: 'Any plans for the weekend?', time: '8:02', isMe: false },
      {
        id: 4,
        text: 'Thinking of going hiking. Want to join?',
        time: '8:03',
        isMe: true,
      },
    ],
    '4': [
      {
        id: 1,
        text: 'Hey, did you see the latest project updates?',
        time: '14:20',
        isMe: false,
      },
      {
        id: 2,
        text: "Yes! Looks like we're ahead of schedule",
        time: '14:22',
        isMe: true,
      },
      {
        id: 3,
        text: "That's fantastic news! Great work everyone",
        time: '14:23',
        isMe: false,
      },
    ],
    '5': [
      {
        id: 1,
        text: 'Hi! I loved your presentation today',
        time: '16:45',
        isMe: false,
      },
      {
        id: 2,
        text: 'Thank you so much! I was nervous but it went well',
        time: '16:46',
        isMe: true,
      },
      {
        id: 3,
        text: 'You did amazing! Very inspiring 👏',
        time: '16:47',
        isMe: false,
      },
      {
        id: 4,
        text: "You're too kind! Thanks for the support",
        time: '16:48',
        isMe: true,
      },
    ],
    '6': [
      {
        id: 1,
        text: 'Are you free for a quick call?',
        time: '11:15',
        isMe: false,
      },
      { id: 2, text: 'Sure! Give me 5 minutes', time: '11:16', isMe: true },
      {
        id: 3,
        text: "Perfect, I'll call you in a bit",
        time: '11:17',
        isMe: false,
      },
    ],
    '101': [
      {
        id: 1,
        text: 'Morning everyone! Ready for the sprint?',
        time: '9:00',
        isMe: false,
        sender: 'Alice',
      },
      { id: 2, text: "Let's do this! 🚀", time: '9:01', isMe: true },
      {
        id: 3,
        text: "I'll share the updated requirements",
        time: '9:02',
        isMe: false,
        sender: 'Bob',
      },
    ],
    '102': [
      {
        id: 1,
        text: 'Beta testing results are in',
        time: '14:30',
        isMe: false,
        sender: 'Carol',
      },
      { id: 2, text: 'Great! How did we do?', time: '14:31', isMe: true },
      {
        id: 3,
        text: '95% success rate! 🎉',
        time: '14:32',
        isMe: false,
        sender: 'Carol',
      },
    ],
  },
};

const users: ImportedUser[] = userData.users;
const groups: ImportedUser[] = userData.groups;
const messages: Record<number, ImportedMessage[]> = userData.messages;

async function seedDatabase() {
  const app = await NestFactory.create(AppModule);
  const sequelize = app.get(Sequelize);

  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Seed users
    const createdUsers: User[] = [];
    for (const userData of users) {
      const user = await User.create({
        id: userData.id,
        username: userData.name.toLowerCase().replace(/\s+/g, '_'),
        password_hash:
          '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // dummy hash
        display_name: userData.name,
        avatar_url: userData.avatar,
        image: userData.image ?? null,
        online: userData.online,
        last_seen: userData.lastSeen,
        phone: userData.phone ?? null,
        about: userData.about ?? null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      createdUsers.push(user);
    }

    // Seed groups (as conversations now)
    // We'll create conversation records for groups instead of user records
    const createdGroups: Conversation[] = [];
    for (const groupData of groups) {
      const conversation = await Conversation.create({
        id: groupData.id,
        name: groupData.name,
        is_group: true,
        created_by: 1, // Assuming user 1 created all groups
        created_at: new Date(),
        updated_at: new Date(),
      });
      createdGroups.push(conversation);
    }

    // Update the sequence for the users table to avoid ID conflicts
    // This ensures that when new users are created, they get IDs that don't conflict with seeded data
    const maxUserId = Math.max(...createdUsers.map((u) => u.id), 0);

    if (maxUserId > 0) {
      await sequelize.query(
        `SELECT setval(pg_get_serial_sequence('users', 'id'), ${maxUserId}, true)`,
      );
      console.log(`Updated user ID sequence to start from ${maxUserId + 1}`);
    }

    // Update the sequence for the conversations table to avoid ID conflicts
    const maxConversationId = Math.max(...createdGroups.map((g) => g.id), 0);

    if (maxConversationId > 0) {
      await sequelize.query(
        `SELECT setval(pg_get_serial_sequence('conversations', 'id'), ${maxConversationId}, true)`,
      );
      console.log(
        `Updated conversation ID sequence to start from ${maxConversationId + 1}`,
      );
    }

    // Create conversation participants for groups
    for (const group of createdGroups) {
      // Add user 1 as admin of all groups
      await ConversationParticipant.create({
        conversation_id: group.id,
        user_id: 1,
        role: 'admin',
        joined_at: new Date(),
      });

      // Add other users as members
      for (const user of createdUsers.slice(1, 3)) {
        // Add first 2 other users as members
        await ConversationParticipant.create({
          conversation_id: group.id,
          user_id: user.id,
          role: 'member',
          joined_at: new Date(),
        });
      }
    }

    // Create 1:1 conversations for direct messages
    const directConversations: Conversation[] = [];
    for (const user of createdUsers.slice(1)) {
      // Create conversations between user 1 and others
      const conversation = await Conversation.create({
        name: null, // Direct messages don't have names
        is_group: false,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });
      directConversations.push(conversation);

      // Add participants to the conversation
      await ConversationParticipant.create({
        conversation_id: conversation.id,
        user_id: 1,
        role: 'member',
        joined_at: new Date(),
      });

      await ConversationParticipant.create({
        conversation_id: conversation.id,
        user_id: user.id,
        role: 'member',
        joined_at: new Date(),
      });
    }

    // Create a mapping of user IDs to user objects
    const userMap: Record<number, User> = {};
    createdUsers.forEach((user) => {
      userMap[user.id] = user;
    });

    // Seed messages
    // For simplicity, we'll create some basic message relationships
    // In a real application, you would need more sophisticated mapping
    let conversationIndex = 0;
    for (const [userId, userMessages] of Object.entries(messages)) {
      const receiverId = parseInt(userId);

      // Determine which conversation to use
      // For this seed, we'll just distribute messages across conversations
      const conversation =
        conversationIndex < directConversations.length
          ? directConversations[conversationIndex]
          : directConversations[0];
      conversationIndex++;

      for (const messageData of userMessages) {
        // For group messages, sender_id should be a valid user ID
        // For user-to-user messages, we'll alternate senders
        let senderId: number;
        const isGroupMessage = receiverId > 100; // Group IDs are > 100

        if (isGroupMessage) {
          // For group messages, use the sender name to find the user
          // If sender name is provided, find the user with that name
          if (messageData.sender) {
            const senderUser = createdUsers.find(
              (u) => u.display_name === messageData.sender,
            );
            senderId = senderUser ? senderUser.id : 1; // Default to user 1 if not found
          } else {
            senderId = messageData.isMe ? 1 : receiverId; // Default logic
          }
        } else {
          // For user-to-user messages
          senderId = messageData.isMe ? 1 : receiverId;
        }

        await Message.create({
          conversation_id: conversation.id,
          sender_id: senderId,
          text: messageData.text,
          attachment_url: null,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    console.log('Database seeded successfully');
  } catch (error: unknown) {
    console.error('Error seeding database:', error);
  } finally {
    await app.close();
  }
}

void seedDatabase();
