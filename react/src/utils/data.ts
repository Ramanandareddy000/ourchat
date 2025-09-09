import { User, Message } from '../types';

export const users: User[] = [
  { 
    id: 1, 
    name: "Alice Johnson", 
    avatar: "A", 
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 123-4567"
  },
  { 
    id: 2, 
    name: "Bob Smith", 
    avatar: "B", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 2 hours ago",
    phone: "+1 (555) 234-5678"
  },
  { 
    id: 3, 
    name: "Carol Davis", 
    avatar: "C", 
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 345-6789"
  },
  { 
    id: 4, 
    name: "David Wilson", 
    avatar: "D", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen yesterday",
    phone: "+1 (555) 456-7890"
  },
  { 
    id: 5, 
    name: "Emma Brown", 
    avatar: "E", 
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online",
    phone: "+1 (555) 567-8901"
  },
  { 
    id: 6, 
    name: "Frank Miller", 
    avatar: "F", 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 5 minutes ago",
    phone: "+1 (555) 678-9012"
  }
];

export const groups: User[] = [
  {
    id: 101,
    name: "Team Alpha",
    avatar: "TA",
    online: true,
    lastSeen: "5 members",
    isGroup: true
  },
  {
    id: 102,
    name: "Project Beta",
    avatar: "PB",
    online: true,
    lastSeen: "8 members",
    isGroup: true
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
