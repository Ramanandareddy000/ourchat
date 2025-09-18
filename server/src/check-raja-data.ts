import { NestFactory } from '@nestjs/core';
import { User, Message, Conversation, ConversationParticipant } from './models';
import { AppModule } from './app.module';

async function checkRajaData() {
  const app = await NestFactory.create(AppModule);
  
  try {
    console.log('Checking data for Raja...');
    
    // Find Raja user
    const rajaUser = await User.findOne({ where: { username: 'raja' } });
    if (!rajaUser) {
      throw new Error('User "raja" not found in the database');
    }
    console.log(`Found Raja user with ID: ${rajaUser.id}`);
    
    // Find all conversations for Raja
    const conversationParticipants = await ConversationParticipant.findAll({
      where: { user_id: rajaUser.id },
      include: [{
        model: Conversation,
        include: [{
          model: ConversationParticipant,
          include: [{
            model: User
          }]
        }]
      }]
    });
    
    console.log(`\nRaja is part of ${conversationParticipants.length} conversations:`);
    
    // Get unique conversations
    const conversations = Array.from(new Set(conversationParticipants.map(cp => cp.conversation.id)))
      .map(id => conversationParticipants.find(cp => cp.conversation.id === id)?.conversation);
    
    for (const conversation of conversations) {
      if (!conversation) continue;
      
      console.log(`\nConversation ID: ${conversation.id}`);
      console.log(`  Type: ${conversation.is_group ? 'Group' : 'Individual'}`);
      console.log(`  Name: ${conversation.name || 'N/A'}`);
      
      // Get participants
      const participants = conversation.participants.map((p: any) => p.user.display_name).join(', ');
      console.log(`  Participants: ${participants}`);
      
      // Get message count
      const messageCount = await Message.count({ where: { conversation_id: conversation.id } });
      console.log(`  Messages: ${messageCount}`);
    }
    
    // Check messages for each conversation
    console.log('\n--- Detailed Conversation Data ---');
    
    for (const conversation of conversations) {
      if (!conversation) continue;
      
      console.log(`\nConversation: ${conversation.name || 'Individual chat'}`);
      
      const messages = await Message.findAll({
        where: { conversation_id: conversation.id },
        include: [{
          model: User,
          as: 'sender'
        }],
        order: [['created_at', 'ASC']]
      });
      
      console.log('Messages:');
      for (const message of messages) {
        console.log(`  ${message.sender.display_name}: ${message.text}`);
      }
    }
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await app.close();
  }
}

void checkRajaData();