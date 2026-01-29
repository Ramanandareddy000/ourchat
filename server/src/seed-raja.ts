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
  { name: null, is_group: false, participants: ['raja', 'suresh'] },
  { name: null, is_group: false, participants: ['raja', 'priya'] },
  { name: null, is_group: false, participants: ['raja', 'ananya'] },
  // Group conversations
  {
    name: 'Family Group',
    is_group: true,
    participants: ['raja', 'suresh', 'priya'],
  },
  {
    name: 'Office Team',
    is_group: true,
    participants: ['raja', 'ananya', 'rahul', 'neha'],
  },
];

// Define messages for each conversation
const messagesToCreate = [
  // Messages for Raja and Suresh
  {
    conversationIndex: 0,
    messages: [
      { text: 'Hey Raja, are you free today?', sender: 'suresh' },
      { text: 'Yes, I am free in the evening.', sender: 'raja' },
      { text: "Great, let's meet at 6 PM.", sender: 'suresh' },
      { text: 'Sure, see you then!', sender: 'raja' },
      { text: 'Looking forward to it! 👋', sender: 'suresh' },
    ],
  },
  // Messages for Raja and Priya
  {
    conversationIndex: 1,
    messages: [
      { text: 'Hi Raja! Did you see the new design mockups?', sender: 'priya' },
      { text: 'Yes, they look amazing! Great work 💯', sender: 'raja' },
      { text: 'Thanks! I put a lot of effort into them', sender: 'priya' },
      { text: 'It shows! The color scheme is perfect', sender: 'raja' },
      {
        text: 'Glad you like it. Let me know if you need any changes',
        sender: 'priya',
      },
      { text: 'Will do. Talk later!', sender: 'raja' },
    ],
  },
  // Messages for Raja and Ananya
  {
    conversationIndex: 2,
    messages: [
      { text: 'Good morning Raja! How was your weekend?', sender: 'ananya' },
      {
        text: 'It was great! Went hiking with family. How about you?',
        sender: 'raja',
      },
      { text: 'That sounds lovely! I just relaxed at home', sender: 'ananya' },
      { text: 'We should plan a team outing soon', sender: 'raja' },
      { text: "Agreed! I'll look into some options", sender: 'ananya' },
    ],
  },
  // Messages for Family Group
  {
    conversationIndex: 3,
    messages: [
      { text: 'Good morning everyone! 🌞', sender: 'suresh' },
      { text: 'Morning! Hope everyone had a good weekend', sender: 'priya' },
      { text: 'Morning all! Just finished breakfast', sender: 'raja' },
      { text: "What are everyone's plans for today?", sender: 'suresh' },
      { text: 'Working from home today', sender: 'priya' },
      { text: 'Same here. Might go to the gym later', sender: 'raja' },
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
      { text: 'Ready to go! 🚀', sender: 'raja' },
      { text: "Let's make this sprint count!", sender: 'rahul' },
      { text: "I've shared the updated requirements", sender: 'neha' },
      { text: "Thanks Neha! I'll review them now", sender: 'raja' },
      { text: 'Any blockers from anyone?', sender: 'ananya' },
      { text: 'All clear from my side', sender: 'rahul' },
      { text: 'Same here', sender: 'raja' },
      { text: "Great! Let's get to work then", sender: 'ananya' },
      { text: 'On it! 💪', sender: 'neha' },
    ],
  },
];

async function seedRajaData() {
  const app = await NestFactory.create(AppModule);

  try {
    console.log('Starting to seed data for Raja...');

    // Find Raja user
    const rajaUser = await User.findOne({ where: { username: 'raja' } });
    if (!rajaUser) {
      throw new Error('User "raja" not found in the database');
    }
    console.log(`Found Raja user with ID: ${rajaUser.id}`);

    // Create users if they don't exist
    const createdUsers: Record<string, User> = { raja: rajaUser };

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
        created_by: rajaUser.id,
      });

      createdConversations.push(conversation);
      console.log(
        `Created ${convData.is_group ? 'group' : 'individual'} conversation with ID: ${conversation.id}`,
      );

      // Add participants to the conversation
      for (const username of convData.participants) {
        const user = createdUsers[username];
        if (user) {
          const role = username === 'raja' ? 'admin' : 'member';
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

    console.log('Successfully seeded data for Raja!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await app.close();
  }
}

void seedRajaData();
