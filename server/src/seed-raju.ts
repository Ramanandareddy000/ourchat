import { NestFactory } from '@nestjs/core';
import { User, Message, Conversation, ConversationParticipant } from './models';
import { AppModule } from './app.module';

// Define the users we need to create or find
const usersToCreate = [
  { username: 'suresh', display_name: 'Suresh', about: 'Software Engineer' },
  { username: 'priya', display_name: 'Priya', about: 'Designer' },
  { username: 'ananya', display_name: 'Ananya', about: 'Product Manager' },
  { username: 'rahul', display_name: 'Rahul', about: 'QA Engineer' },
  { username: 'neha', display_name: 'Neha', about: 'DevOps Engineer' },
];

// Define the conversations we need to create
const conversationsToCreate = [
  // Individual conversations
  { name: null, is_group: false, participants: ['raju', 'suresh'] },
  { name: null, is_group: false, participants: ['raju', 'priya'] },
  { name: null, is_group: false, participants: ['raju', 'ananya'] },
  // Group conversations
  {
    name: 'Family Group',
    is_group: true,
    participants: ['raju', 'suresh', 'priya'],
  },
  {
    name: 'Office Team',
    is_group: true,
    participants: ['raju', 'ananya', 'rahul', 'neha'],
  },
];

// Define messages for each conversation
const messagesToCreate = [
  // Messages for Raju and Suresh
  {
    conversationIndex: 0,
    messages: [
      { text: 'Hey Raju, are you free today?', sender: 'suresh' },
      { text: 'Yes, I am free in the evening.', sender: 'raju' },
      { text: "Great, let's meet at 6 PM.", sender: 'suresh' },
      { text: 'Sure, see you then!', sender: 'raju' },
      { text: 'Looking forward to it! 👋', sender: 'suresh' },
    ],
  },
  // Messages for Raju and Priya
  {
    conversationIndex: 1,
    messages: [
      { text: 'Hi Raju! Did you see the new design mockups?', sender: 'priya' },
      { text: 'Yes, they look amazing! Great work 💯', sender: 'raju' },
      { text: 'Thanks! I put a lot of effort into them', sender: 'priya' },
      { text: 'It shows! The color scheme is perfect', sender: 'raju' },
      {
        text: 'Glad you like it. Let me know if you need any changes',
        sender: 'priya',
      },
      { text: 'Will do. Talk later!', sender: 'raju' },
    ],
  },
  // Messages for Raju and Ananya
  {
    conversationIndex: 2,
    messages: [
      { text: 'Good morning Raju! How was your weekend?', sender: 'ananya' },
      {
        text: 'It was great! Went hiking with family. How about you?',
        sender: 'raju',
      },
      { text: 'That sounds lovely! I just relaxed at home', sender: 'ananya' },
      { text: 'We should plan a team outing soon', sender: 'raju' },
      { text: "Agreed! I'll look into some options", sender: 'ananya' },
    ],
  },
  // Messages for Family Group
  {
    conversationIndex: 3,
    messages: [
      { text: 'Good morning everyone! 🌞', sender: 'suresh' },
      { text: 'Morning! Hope everyone had a good weekend', sender: 'priya' },
      { text: 'Morning all! Just finished breakfast', sender: 'raju' },
      { text: "What are everyone's plans for today?", sender: 'suresh' },
      { text: 'Working from home today', sender: 'priya' },
      { text: 'Same here. Might go to the gym later', sender: 'raju' },
      { text: 'I have a meeting in the afternoon', sender: 'suresh' },
      {
        text: 'Sounds like a productive day ahead for everyone!',
        sender: 'priya',
      },
    ],
  },
  // Messages for Office Team
  {
    conversationIndex: 4,
    messages: [
      { text: 'Morning team! Ready for the sprint?', sender: 'ananya' },
      { text: 'Ready to go! 🚀', sender: 'raju' },
      { text: "Let's make this sprint count!", sender: 'rahul' },
      { text: "I've shared the updated requirements", sender: 'neha' },
      { text: "Thanks Neha! I'll review them now", sender: 'raju' },
      { text: 'Any blockers from anyone?', sender: 'ananya' },
      { text: 'All clear from my side', sender: 'rahul' },
      { text: 'Same here', sender: 'raju' },
      { text: "Great! Let's get to work then", sender: 'ananya' },
      { text: 'On it! 💪', sender: 'neha' },
    ],
  },
];

async function seedRajuData() {
  const app = await NestFactory.create(AppModule);

  try {
    console.log('Starting to seed data for Raju...');

    // Find Raju user
    const rajuUser = await User.findOne({ where: { username: 'raju' } });
    if (!rajuUser) {
      throw new Error('User "raju" not found in the database');
    }
    console.log(`Found Raju user with ID: ${rajuUser.id}`);

    // Create users if they don't exist
    const createdUsers: Record<string, User> = { raju: rajuUser };

    for (const userData of usersToCreate) {
      let user = await User.findOne({ where: { username: userData.username } });
      if (!user) {
        user = await User.create({
          username: userData.username,
          password_hash:
            '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
          display_name: userData.display_name,
          about: userData.about,
          online: false,
          last_seen: 'recently',
        });
        console.log(
          `Created user: ${userData.display_name} (${userData.username})`,
        );
      } else {
        console.log(
          `Found existing user: ${userData.display_name} (${userData.username})`,
        );
      }
      createdUsers[userData.username] = user;
    }

    // Create conversations
    const createdConversations: Conversation[] = [];

    for (const convData of conversationsToCreate) {
      const conversation = await Conversation.create({
        name: convData.name,
        is_group: convData.is_group,
        created_by: rajuUser.id,
      });

      createdConversations.push(conversation);
      console.log(
        `Created ${convData.is_group ? 'group' : 'individual'} conversation with ID: ${conversation.id}`,
      );

      // Add participants to the conversation
      for (const username of convData.participants) {
        const user = createdUsers[username];
        if (user) {
          const role = username === 'raju' ? 'admin' : 'member';
          await ConversationParticipant.create({
            conversation_id: conversation.id,
            user_id: user.id,
            role: role,
          });
          console.log(
            `Added ${user.display_name} as ${role} to conversation ${conversation.id}`,
          );
        }
      }
    }

    // Create messages with realistic timestamps
    const baseTime = new Date();

    for (const convMessages of messagesToCreate) {
      const conversation = createdConversations[convMessages.conversationIndex];

      for (let i = 0; i < convMessages.messages.length; i++) {
        const messageData = convMessages.messages[i];
        const senderUser = createdUsers[messageData.sender];

        if (senderUser) {
          // Create timestamps with slight variations to make it realistic
          const messageTime = new Date(baseTime);
          messageTime.setMinutes(
            baseTime.getMinutes() - convMessages.messages.length + i,
          );

          await Message.create({
            conversation_id: conversation.id,
            sender_id: senderUser.id,
            text: messageData.text,
            created_at: messageTime,
            updated_at: messageTime,
          });
        }
      }

      console.log(
        `Added ${convMessages.messages.length} messages to conversation ${conversation.id}`,
      );
    }

    console.log('Successfully seeded data for Raju!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await app.close();
  }
}

void seedRajuData();
