import { NestFactory } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { User, Message } from './models';
import { AppModule } from './app.module';

// Define interfaces for the imported data
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

// Import data with type assertions
import * as fs from 'fs';
import * as path from 'path';

const userDataPath = path.resolve(__dirname, '../../react/src/utils/data.json');
const userData: UserData = JSON.parse(
  fs.readFileSync(userDataPath, 'utf8'),
) as UserData;

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
        is_group: userData.isGroup || false,
        created_at: new Date(),
        updated_at: new Date(),
      });
      createdUsers.push(user);
    }

    // Seed groups
    const createdGroups: User[] = [];
    for (const groupData of groups) {
      const group = await User.create({
        id: groupData.id,
        username: groupData.name.toLowerCase().replace(/\s+/g, '_'),
        password_hash:
          '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // dummy hash
        display_name: groupData.name,
        avatar_url: groupData.avatar,
        image: null,
        online: groupData.online,
        last_seen: groupData.lastSeen,
        phone: null,
        about: null,
        is_group: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
      createdGroups.push(group);
    }

    // Update the sequence for the users table to avoid ID conflicts
    // This ensures that when new users are created, they get IDs that don't conflict with seeded data
    const maxUserId = Math.max(
      ...createdUsers.map((u) => u.id),
      ...createdGroups.map((g) => g.id),
      0,
    );

    if (maxUserId > 0) {
      await sequelize.query(
        `SELECT setval(pg_get_serial_sequence('users', 'id'), ${maxUserId}, true)`,
      );
      console.log(`Updated user ID sequence to start from ${maxUserId + 1}`);
    }

    // Combine users and groups for message creation
    const allUsers = [...createdUsers, ...createdGroups];

    // Create a mapping of user IDs to user objects
    const userMap: Record<number, User> = {};
    allUsers.forEach((user) => {
      userMap[user.id] = user;
    });

    // Seed messages
    // For simplicity, we'll create some basic message relationships
    // In a real application, you would need more sophisticated mapping
    for (const [userId, userMessages] of Object.entries(messages)) {
      const receiverId = parseInt(userId);

      for (const messageData of userMessages) {
        // For group messages, sender_id should be a valid user ID
        // For user-to-user messages, we'll alternate senders
        let senderId: number;
        const isGroupMessage = receiverId > 100; // Group IDs are > 100

        if (isGroupMessage) {
          // For group messages, use the sender name to find the user
          // If sender name is provided, find the user with that name
          if (messageData.sender) {
            const senderUser = allUsers.find(
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
          text: messageData.text,
          time: messageData.time,
          is_me: messageData.isMe,
          sender_id: senderId,
          sender_name: messageData.sender ?? null,
          receiver_id: messageData.isMe ? receiverId : 1,
          is_group: isGroupMessage,
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
