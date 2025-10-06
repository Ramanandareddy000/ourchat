import { NestFactory } from '@nestjs/core';
import { User, Message, Conversation, ConversationParticipant } from './models';
import { AppModule } from './app.module';

// Define realistic user data
const realisticUsers = [
  {
    username: 'alex_morgan',
    display_name: 'Alex Morgan',
    about: 'Software Developer 💻 | Coffee enthusiast ☕',
    avatar_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
  },
  {
    username: 'sarah_johnson',
    display_name: 'Sarah Johnson',
    about: 'UX Designer 🎨 | Dog lover 🐶',
    avatar_url:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 234-5678',
  },
  {
    username: 'michael_chen',
    display_name: 'Michael Chen',
    about: 'Product Manager 🚀 | Traveler ✈️',
    avatar_url:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 345-6789',
  },
  {
    username: 'emily_davis',
    display_name: 'Emily Davis',
    about: 'Data Scientist 📊 | Bookworm 📚',
    avatar_url:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 456-7890',
  },
  {
    username: 'david_wilson',
    display_name: 'David Wilson',
    about: 'DevOps Engineer ⚙️ | Guitar player 🎸',
    avatar_url:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 567-8901',
  },
  {
    username: 'jessica_brown',
    display_name: 'Jessica Brown',
    about: 'Marketing Specialist 📈 | Foodie 🍜',
    avatar_url:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 678-9012',
  },
];

// Define conversation names
const groupConversations = [
  {
    name: 'Tech Enthusiasts',
    description: 'A group for discussing the latest in technology',
  },
  {
    name: 'Weekend Warriors',
    description: 'Planning our weekend adventures',
  },
];

// Define realistic message templates for different contexts
const messageTemplates = {
  greetings: [
    "Hey there! How's your day going? 🌞",
    "Good morning! Hope you're having a wonderful day!",
    "Hi! Just checking in to see how you're doing",
    "Hello! What's new with you today?",
    'Hey! Hope your week is off to a great start!',
  ],
  casual: [
    'Did you catch the game last night? 🏈',
    "I've been listening to this amazing new podcast series",
    'The weather has been so nice lately, perfect for outdoor activities',
    'I tried a new recipe this weekend, turned out great!',
    'Just finished reading an interesting article about AI developments',
    'Have you watched anything good lately?',
    "I'm thinking of taking a short trip next month",
  ],
  questions: [
    'Are you free for a quick call later?',
    'What are your plans for the weekend?',
    'Do you have any recommendations for a good restaurant in the area?',
    "How's that project you were working on coming along?",
    'Any suggestions for a good book to read?',
    'What time works best for you tomorrow?',
  ],
  replies: [
    'That sounds great! Count me in 😊',
    'I completely agree with you on that',
    "Thanks for sharing, I'll definitely check it out",
    'I was thinking the same thing!',
    "That's a good point, I hadn't considered that",
    "I'm so glad you mentioned that!",
    "Absolutely! Let's make it happen",
  ],
  groupChat: [
    'Hey everyone! 👋',
    'Good morning team! Ready for another productive day?',
    "What's everyone working on today?",
    "Don't forget about the meeting later!",
    'Anyone up for grabbing lunch together?',
    'I found this interesting article, thought you all might enjoy it',
    'Happy Friday everyone! 🎉',
    'Hope you all have a wonderful weekend!',
  ],
};

// Function to generate realistic messages for a conversation
function generateMessagesForConversation(
  participants: { id: number; display_name: string }[],
  isGroup: boolean,
  count: number,
): { text: string; sender_id: number }[] {
  const messages: { text: string; sender_id: number }[] = [];
  const now = new Date();

  // Create a variety of messages
  for (let i = 0; i < count; i++) {
    // Simulate different times (spread over several days)
    const messageTime = new Date(now);
    messageTime.setDate(now.getDate() - Math.floor(Math.random() * 5));
    messageTime.setHours(Math.floor(Math.random() * 24));
    messageTime.setMinutes(Math.floor(Math.random() * 60));

    let text = '';
    let sender_id = 0;

    if (isGroup) {
      // For group chats, randomly select a participant as sender
      const sender =
        participants[Math.floor(Math.random() * participants.length)];
      sender_id = sender.id;

      // Randomly choose message type
      const messageType = Math.random();
      if (messageType < 0.3) {
        text =
          messageTemplates.groupChat[
            Math.floor(Math.random() * messageTemplates.groupChat.length)
          ];
      } else if (messageType < 0.6) {
        text =
          messageTemplates.casual[
            Math.floor(Math.random() * messageTemplates.casual.length)
          ];
      } else {
        text =
          messageTemplates.greetings[
            Math.floor(Math.random() * messageTemplates.greetings.length)
          ];
      }
    } else {
      // For 1:1 chats, alternate between participants
      const senderIndex = i % participants.length;
      sender_id = participants[senderIndex].id;

      // Randomly choose message type
      const messageType = Math.random();
      if (messageType < 0.25) {
        text =
          messageTemplates.greetings[
            Math.floor(Math.random() * messageTemplates.greetings.length)
          ];
      } else if (messageType < 0.5) {
        text =
          messageTemplates.questions[
            Math.floor(Math.random() * messageTemplates.questions.length)
          ];
      } else if (messageType < 0.75) {
        text =
          messageTemplates.replies[
            Math.floor(Math.random() * messageTemplates.replies.length)
          ];
      } else {
        text =
          messageTemplates.casual[
            Math.floor(Math.random() * messageTemplates.casual.length)
          ];
      }
    }

    // Add some emojis randomly
    if (Math.random() > 0.7) {
      const emojis = [
        '😊',
        '👍',
        '🎉',
        '🔥',
        '💯',
        '🙌',
        '👏',
        '😎',
        '🤩',
        '🥳',
      ];
      text += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }

    messages.push({ text, sender_id });
  }

  return messages;
}

async function seedRealisticData() {
  const app = await NestFactory.create(AppModule);

  try {
    console.log('Starting to seed realistic data...');

    // Find Raju user (assuming it exists)
    const rajuUser = await User.findOne({ where: { username: 'raju' } });
    if (!rajuUser) {
      throw new Error('User "raju" not found in the database');
    }
    console.log(`Found Raju user with ID: ${rajuUser.id}`);

    // Create users if they don't exist
    const createdUsers: Record<string, User> = { raju: rajuUser };

    for (const userData of realisticUsers) {
      let user = await User.findOne({ where: { username: userData.username } });
      if (!user) {
        user = await User.create({
          username: userData.username,
          password_hash:
            '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // dummy hash
          display_name: userData.display_name,
          about: userData.about,
          avatar_url: userData.avatar_url,
          phone: userData.phone,
          online: Math.random() > 0.5, // Random online status
          last_seen: Math.random() > 0.5 ? 'online' : 'last seen recently',
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

    // Create 1:1 conversations between Raju and other users
    const oneToOneConversations: Conversation[] = [];

    // Create conversations with first 3 users
    const oneToOneParticipants = Object.values(createdUsers).slice(1, 4); // Skip Raju, take next 3

    for (const participant of oneToOneParticipants) {
      // Check if conversation already exists
      const existingConversation = await Conversation.findOne({
        include: [
          {
            model: ConversationParticipant,
            where: {
              user_id: [rajuUser.id, participant.id],
            },
          },
        ],
      });

      if (!existingConversation) {
        const conversation = await Conversation.create({
          name: null,
          is_group: false,
          created_by: rajuUser.id,
        });

        oneToOneConversations.push(conversation);
        console.log(`Created 1:1 conversation with ID: ${conversation.id}`);

        // Add participants
        await ConversationParticipant.create({
          conversation_id: conversation.id,
          user_id: rajuUser.id,
          role: 'member',
        });

        await ConversationParticipant.create({
          conversation_id: conversation.id,
          user_id: participant.id,
          role: 'member',
        });

        console.log(`Added participants to conversation ${conversation.id}`);
      } else {
        oneToOneConversations.push(existingConversation);
        console.log(
          `Using existing conversation with ID: ${existingConversation.id}`,
        );
      }
    }

    // Create group conversations
    const groupConversationsCreated: Conversation[] = [];

    // Create two group conversations
    for (let i = 0; i < groupConversations.length; i++) {
      const groupData = groupConversations[i];

      const conversation = await Conversation.create({
        name: groupData.name,
        is_group: true,
        created_by: rajuUser.id,
      });

      groupConversationsCreated.push(conversation);
      console.log(
        `Created group conversation "${groupData.name}" with ID: ${conversation.id}`,
      );

      // Add participants (Raju + 3-4 other users)
      const participantsToAdd = [
        rajuUser,
        ...Object.values(createdUsers).slice(1, 4 + i), // Vary the number of participants
      ];

      for (let j = 0; j < participantsToAdd.length; j++) {
        const participant = participantsToAdd[j];
        const role = j === 0 ? 'admin' : 'member'; // Raju as admin

        await ConversationParticipant.create({
          conversation_id: conversation.id,
          user_id: participant.id,
          role: role,
        });

        console.log(
          `Added ${participant.display_name} as ${role} to group "${groupData.name}"`,
        );
      }
    }

    // Add realistic messages to 1:1 conversations
    for (let i = 0; i < oneToOneConversations.length; i++) {
      const conversation = oneToOneConversations[i];
      const participantUser = oneToOneParticipants[i];

      // Get participants for this conversation
      const participants = [
        { id: rajuUser.id, display_name: rajuUser.display_name },
        { id: participantUser.id, display_name: participantUser.display_name },
      ];

      // Generate 10-15 messages
      const messageCount = 10 + Math.floor(Math.random() * 6);
      const messages = generateMessagesForConversation(
        participants,
        false,
        messageCount,
      );

      // Add messages to database
      for (const messageData of messages) {
        await Message.create({
          conversation_id: conversation.id,
          sender_id: messageData.sender_id,
          text: messageData.text,
          attachment_url: null,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      console.log(
        `Added ${messages.length} messages to 1:1 conversation ${conversation.id}`,
      );
    }

    // Add realistic messages to group conversations
    for (let i = 0; i < groupConversationsCreated.length; i++) {
      const conversation = groupConversationsCreated[i];
      const groupData = groupConversations[i];

      // Get participants for this group
      const participantRecords = await ConversationParticipant.findAll({
        where: { conversation_id: conversation.id },
        include: [{ model: User }],
      });

      const participants = participantRecords.map((record) => ({
        id: record.user.id,
        display_name: record.user.display_name,
      }));

      // Generate 12-18 messages
      const messageCount = 12 + Math.floor(Math.random() * 7);
      const messages = generateMessagesForConversation(
        participants,
        true,
        messageCount,
      );

      // Add messages to database
      for (const messageData of messages) {
        await Message.create({
          conversation_id: conversation.id,
          sender_id: messageData.sender_id,
          text: messageData.text,
          attachment_url: null,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      console.log(
        `Added ${messages.length} messages to group conversation "${groupData.name}" (${conversation.id})`,
      );
    }

    console.log('Successfully seeded realistic data!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await app.close();
  }
}

void seedRealisticData();
