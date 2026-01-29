import { NestFactory } from '@nestjs/core';
import { User, Conversation, ConversationParticipant, Message } from './models';
import { AppModule } from './app.module';

async function addTestUserToConversations() {
  const app = await NestFactory.create(AppModule);

  try {
    // Find the test user
    const testUser = await User.findOne({ where: { username: 'test' } });
    if (!testUser) {
      throw new Error('Test user not found');
    }

    console.log(`Found test user with ID: ${testUser.id}`);

    // Find an existing group conversation to add the test user to
    const groupConversation = await Conversation.findOne({
      where: { is_group: true },
      order: [['id', 'DESC']], // Get the most recent group
    });

    if (!groupConversation) {
      throw new Error('No group conversation found');
    }

    console.log(`Found group conversation with ID: ${groupConversation.id}`);

    // Add test user to the group conversation
    await ConversationParticipant.create({
      conversation_id: groupConversation.id,
      user_id: testUser.id,
      role: 'member',
    });

    console.log(
      `Added test user to group conversation ${groupConversation.id}`,
    );

    // Add a few messages from the test user to the group
    const messages = [
      'Hello everyone! I just joined this group.',
      'This is my first message here. Excited to be part of the team!',
      'Does anyone have any recommendations for a good restaurant in the area?',
    ];

    for (let i = 0; i < messages.length; i++) {
      await Message.create({
        conversation_id: groupConversation.id,
        sender_id: testUser.id,
        text: messages[i],
        attachment_url: null,
        created_at: new Date(Date.now() - (messages.length - i) * 60000), // Stagger timestamps
        updated_at: new Date(Date.now() - (messages.length - i) * 60000),
      });
    }

    console.log(
      `Added ${messages.length} messages from test user to group conversation`,
    );

    // Also add test user to a 1:1 conversation with an existing user
    // Find an existing user (other than test user)
    const existingUser = await User.findOne({
      where: {
        username: 'raju', // Use raju since we know this user exists
      },
    });

    if (!existingUser) {
      throw new Error('Raju user not found');
    }

    console.log(`Found existing user (raju) with ID: ${existingUser.id}`);

    // Create a 1:1 conversation between test user and raju
    const oneToOneConversation = await Conversation.create({
      name: null,
      is_group: false,
      created_by: testUser.id,
    });

    console.log(`Created 1:1 conversation with ID: ${oneToOneConversation.id}`);

    // Add both users as participants
    await ConversationParticipant.create({
      conversation_id: oneToOneConversation.id,
      user_id: testUser.id,
      role: 'member',
    });

    await ConversationParticipant.create({
      conversation_id: oneToOneConversation.id,
      user_id: existingUser.id,
      role: 'member',
    });

    console.log(`Added both users as participants to 1:1 conversation`);

    // Add messages to the 1:1 conversation
    const oneToOneMessages = [
      { sender_id: testUser.id, text: "Hi Raju! I'm the new test user." },
      {
        sender_id: existingUser.id,
        text: 'Welcome to the platform! How can I help you?',
      },
      {
        sender_id: testUser.id,
        text: "I'm just testing the chat functionality. Everything looks great so far!",
      },
      {
        sender_id: existingUser.id,
        text: 'Glad to hear it! Let me know if you need any assistance.',
      },
    ];

    for (let i = 0; i < oneToOneMessages.length; i++) {
      const msg = oneToOneMessages[i];
      await Message.create({
        conversation_id: oneToOneConversation.id,
        sender_id: msg.sender_id,
        text: msg.text,
        attachment_url: null,
        created_at: new Date(
          Date.now() - (oneToOneMessages.length - i) * 60000,
        ),
        updated_at: new Date(
          Date.now() - (oneToOneMessages.length - i) * 60000,
        ),
      });
    }

    console.log(
      `Added ${oneToOneMessages.length} messages to 1:1 conversation`,
    );

    console.log(
      'Successfully added test user to conversations and created messages!',
    );
  } catch (error) {
    console.error('Error adding test user to conversations:', error);
  } finally {
    await app.close();
  }
}

void addTestUserToConversations();
