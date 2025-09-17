import { User, Message } from '../types';
import * as dataService from '../modules/api/data-service';

// Function to fetch users from the database
export const fetchUsersFromDB = async (): Promise<User[]> => {
  try {
    const users = await dataService.fetchUsers();
    return users;
  } catch (error) {
    console.error('Failed to fetch users from database:', error);
    // Return empty array or fallback to static data if needed
    return [];
  }
};

// Function to fetch messages from the database
export const fetchMessagesFromDB = async (): Promise<Record<number, Message[]>> => {
  try {
    const messages = await dataService.fetchMessages();
    // Group messages by user ID for easier access
    const groupedMessages: Record<number, Message[]> = {};
    
    messages.forEach(message => {
      const userId = message.is_group ? message.receiver_id : 
                     message.isMe ? message.receiver_id : message.sender_id;
      
      if (!groupedMessages[userId]) {
        groupedMessages[userId] = [];
      }
      
      groupedMessages[userId].push({
        id: message.id,
        text: message.text,
        time: message.time,
        isMe: message.isMe,
        sender: message.sender,
      });
    });
    
    return groupedMessages;
  } catch (error) {
    console.error('Failed to fetch messages from database:', error);
    // Return empty object or fallback to static data if needed
    return {};
  }
};

// Function to fetch messages for a specific user from the database
export const fetchUserMessagesFromDB = async (userId: number): Promise<Message[]> => {
  try {
    const messages = await dataService.fetchMessagesByUserId(userId);
    return messages.map(message => ({
      id: message.id,
      text: message.text,
      time: message.time,
      isMe: message.isMe,
      sender: message.sender,
    }));
  } catch (error) {
    console.error(`Failed to fetch messages for user ${userId} from database:`, error);
    // Return empty array or fallback to static data if needed
    return [];
  }
};

// Static data as fallback
export const users: User[] = [
  { 
    id: 1, 
    username: "alicejohnson",
    display_name: "Alice Johnson", 
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    online: true,
    last_seen: "online",
    phone: "+1 (555) 123-4567",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  { 
    id: 2, 
    username: "bobsmith",
    display_name: "Bob Smith", 
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    online: false,
    last_seen: "last seen 2 hours ago",
    phone: "+1 (555) 234-5678",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  { 
    id: 3, 
    username: "caroldavis",
    display_name: "Carol Davis", 
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    online: true,
    last_seen: "online",
    phone: "+1 (555) 345-6789",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  { 
    id: 4, 
    username: "davidwilson",
    display_name: "David Wilson", 
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    online: false,
    last_seen: "last seen yesterday",
    phone: "+1 (555) 456-7890",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  { 
    id: 5, 
    username: "emmabrown",
    display_name: "Emma Brown", 
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    online: true,
    last_seen: "online",
    phone: "+1 (555) 567-8901",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  { 
    id: 6, 
    username: "frankmiller",
    display_name: "Frank Miller", 
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    online: false,
    last_seen: "last seen 5 minutes ago",
    phone: "+1 (555) 678-9012",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];

export const groups: User[] = [
  {
    id: 101,
    username: "teamalpha",
    display_name: "Team Alpha",
    avatar_url: "TA",
    online: true,
    last_seen: "5 members",
    is_group: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: 102,
    username: "projectbeta",
    display_name: "Project Beta",
    avatar_url: "PB",
    online: true,
    last_seen: "8 members",
    is_group: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];

export const messages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hey! How's your day going?", time: "10:30", isMe: false },
    { id: 2, text: "Pretty good! Just finished a meeting. How about you?", time: "10:31", isMe: true },
    { id: 3, text: "Same here! Want to grab lunch later?", time: "10:32", isMe: false },
    { id: 4, text: "Sounds great! How about 1 PM?", time: "10:33", isMe: false },
    { id: 5, text: "Perfect! See you then 😊", time: "10:34", isMe: false }
  ],
  2: [
    { id: 1, text: "Don't forget about the team meeting at 3pm", time: "9:15", isMe: false },
    { id: 2, text: "Thanks for the reminder! I'll be there", time: "9:16", isMe: true },
    { id: 3, text: "Great! I'll send the agenda in a few minutes", time: "9:17", isMe: false },
    { id: 4, text: "Awesome, looking forward to it", time: "9:18", isMe: true }
  ],
  3: [
    { id: 1, text: "Good morning! Hope you have a wonderful day", time: "8:00", isMe: false },
    { id: 2, text: "Good morning Carol! Thank you, you too! ☀️", time: "8:01", isMe: true },
    { id: 3, text: "Any plans for the weekend?", time: "8:02", isMe: false },
    { id: 4, text: "Thinking of going hiking. Want to join?", time: "8:03", isMe: true }
  ],
  4: [
    { id: 1, text: "Hey, did you see the latest project updates?", time: "14:20", isMe: false },
    { id: 2, text: "Yes! Looks like we're ahead of schedule", time: "14:22", isMe: true },
    { id: 3, text: "That's fantastic news! Great work everyone", time: "14:23", isMe: false }
  ],
  5: [
    { id: 1, text: "Hi! I loved your presentation today", time: "16:45", isMe: false },
    { id: 2, text: "Thank you so much! I was nervous but it went well", time: "16:46", isMe: true },
    { id: 3, text: "You did amazing! Very inspiring 👏", time: "16:47", isMe: false },
    { id: 4, text: "You're too kind! Thanks for the support", time: "16:48", isMe: true }
  ],
  6: [
    { id: 1, text: "Are you free for a quick call?", time: "11:15", isMe: false },
    { id: 2, text: "Sure! Give me 5 minutes", time: "11:16", isMe: true },
    { id: 3, text: "Perfect, I'll call you in a bit", time: "11:17", isMe: false }
  ],
  101: [
    { id: 1, text: "Morning everyone! Ready for the sprint?", time: "9:00", isMe: false, sender: "Alice" },
    { id: 2, text: "Let's do this! 🚀", time: "9:01", isMe: true },
    { id: 3, text: "I'll share the updated requirements", time: "9:02", isMe: false, sender: "Bob" }
  ],
  102: [
    { id: 1, text: "Beta testing results are in", time: "14:30", isMe: false, sender: "Carol" },
    { id: 2, text: "Great! How did we do?", time: "14:31", isMe: true },
    { id: 3, text: "95% success rate! 🎉", time: "14:32", isMe: false, sender: "Carol" }
  ]
};