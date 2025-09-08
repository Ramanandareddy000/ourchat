export const users = [
  { 
    id: 1, 
    name: "Alice Johnson", 
    avatar: "A", 
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online"
  },
  { 
    id: 2, 
    name: "Bob Smith", 
    avatar: "B", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 2 hours ago"
  },
  { 
    id: 3, 
    name: "Carol Davis", 
    avatar: "C", 
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online"
  },
  { 
    id: 4, 
    name: "David Wilson", 
    avatar: "D", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen yesterday"
  },
  { 
    id: 5, 
    name: "Emma Brown", 
    avatar: "E", 
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online"
  },
  { 
    id: 6, 
    name: "Frank Miller", 
    avatar: "F", 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 5 minutes ago"
  },
  { 
    id: 7, 
    name: "Grace Lee", 
    avatar: "G", 
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online"
  },
  { 
    id: 8, 
    name: "Henry Clark", 
    avatar: "H", 
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 1 hour ago"
  },
  { 
    id: 9, 
    name: "Ivy Rodriguez", 
    avatar: "I", 
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online"
  },
  { 
    id: 10, 
    name: "Jack Thompson", 
    avatar: "J", 
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 3 days ago"
  },
  { 
    id: 11, 
    name: "Kate Anderson", 
    avatar: "K", 
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    online: true,
    lastSeen: "online"
  },
  { 
    id: 12, 
    name: "Liam Garcia", 
    avatar: "L", 
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    online: false,
    lastSeen: "last seen 30 minutes ago"
  }
];

export const messages = {
  1: [
    { text: "Hey! How's your day going?", time: "10:30", isMe: false },
    { text: "Pretty good! Just finished a meeting. How about you?", time: "10:31", isMe: true },
    { text: "Same here! Want to grab lunch later?", time: "10:32", isMe: false },
    { text: "Sounds great! How about 1 PM?", time: "10:33", isMe: false },
    { text: "Perfect! See you then 😊", time: "10:34", isMe: false }
  ],
  2: [
    { text: "Don't forget about the team meeting at 3pm", time: "9:15", isMe: false },
    { text: "Thanks for the reminder! I'll be there", time: "9:16", isMe: true },
    { text: "Great! I'll send the agenda in a few minutes", time: "9:17", isMe: false },
    { text: "Awesome, looking forward to it", time: "9:18", isMe: true }
  ],
  3: [
    { text: "Good morning! Hope you have a wonderful day", time: "8:00", isMe: false },
    { text: "Good morning Carol! Thank you, you too! ☀️", time: "8:01", isMe: true },
    { text: "Any plans for the weekend?", time: "8:02", isMe: false },
    { text: "Thinking of going hiking. Want to join?", time: "8:03", isMe: true }
  ],
  4: [
    { text: "Hey, did you see the latest project updates?", time: "14:20", isMe: false },
    { text: "Yes! Looks like we're ahead of schedule", time: "14:22", isMe: true },
    { text: "That's fantastic news! Great work everyone", time: "14:23", isMe: false }
  ],
  5: [
    { text: "Hi! I loved your presentation today", time: "16:45", isMe: false },
    { text: "Thank you so much! I was nervous but it went well", time: "16:46", isMe: true },
    { text: "You did amazing! Very inspiring 👏", time: "16:47", isMe: false },
    { text: "You're too kind! Thanks for the support", time: "16:48", isMe: true }
  ],
  6: [
    { text: "Are you free for a quick call?", time: "11:15", isMe: false },
    { text: "Sure! Give me 5 minutes", time: "11:16", isMe: true },
    { text: "Perfect, I'll call you in a bit", time: "11:17", isMe: false }
  ],
  7: [
    { text: "Thanks for helping me with the code review!", time: "15:30", isMe: false },
    { text: "No problem! Your code looks great", time: "15:31", isMe: true },
    { text: "I learned a lot from your feedback", time: "15:32", isMe: false },
    { text: "Happy to help anytime! 🚀", time: "15:33", isMe: true }
  ],
  8: [
    { text: "Did you catch the game last night?", time: "12:45", isMe: false },
    { text: "Yes! What a match! Can't believe that last goal", time: "12:46", isMe: true },
    { text: "I know right! Best game of the season", time: "12:47", isMe: false }
  ],
  9: [
    { text: "Coffee break? ☕", time: "14:00", isMe: false },
    { text: "Always! Meet you at the usual spot?", time: "14:01", isMe: true },
    { text: "Yep! See you in 5", time: "14:02", isMe: false },
    { text: "On my way!", time: "14:03", isMe: true }
  ],
  10: [
    { text: "Happy birthday! 🎉", time: "9:00", isMe: true },
    { text: "Thank you so much! You remembered!", time: "9:30", isMe: false },
    { text: "Of course! Hope you have an amazing day", time: "9:31", isMe: true }
  ],
  11: [
    { text: "The new restaurant downtown is amazing!", time: "19:20", isMe: false },
    { text: "Really? What kind of food?", time: "19:21", isMe: true },
    { text: "Italian! Best pasta I've had in ages", time: "19:22", isMe: false },
    { text: "Sounds delicious! Let's go together sometime", time: "19:23", isMe: true },
    { text: "Definitely! I'll make a reservation", time: "19:24", isMe: false }
  ],
  12: [
    { text: "Can you send me the report when you're done?", time: "13:10", isMe: false },
    { text: "Sure! Just finishing up the final section", time: "13:11", isMe: true },
    { text: "No rush, whenever you're ready", time: "13:12", isMe: false },
    { text: "Should be ready in about 20 minutes", time: "13:13", isMe: true }
  ]
};

export const groups = [
  {
    id: 101,
    name: "Team Alpha",
    avatar: "TA",
    image: "",
    online: true,
    lastSeen: "5 members",
    isGroup: true
  },
  {
    id: 102,
    name: "Project Beta",
    avatar: "PB",
    image: "",
    online: true,
    lastSeen: "8 members",
    isGroup: true
  },
  {
    id: 103,
    name: "Design Squad",
    avatar: "DS",
    image: "",
    online: true,
    lastSeen: "12 members",
    isGroup: true
  },
  {
    id: 104,
    name: "Dev Team",
    avatar: "DT",
    image: "",
    online: true,
    lastSeen: "6 members",
    isGroup: true
  }
];

export const groupMessages = {
  101: [
    { text: "Morning everyone! Ready for the sprint?", time: "9:00", isMe: false, sender: "Alice" },
    { text: "Let's do this! 🚀", time: "9:01", isMe: true },
    { text: "I'll share the updated requirements", time: "9:02", isMe: false, sender: "Bob" }
  ],
  102: [
    { text: "Beta testing results are in", time: "14:30", isMe: false, sender: "Carol" },
    { text: "Great! How did we do?", time: "14:31", isMe: true },
    { text: "95% success rate! 🎉", time: "14:32", isMe: false, sender: "Carol" }
  ],
  103: [
    { text: "New mockups are ready for review", time: "11:15", isMe: false, sender: "Emma" },
    { text: "Looking good! Love the color scheme", time: "11:16", isMe: true }
  ],
  104: [
    { text: "Code review at 3 PM today", time: "10:45", isMe: false, sender: "David" },
    { text: "I'll be there", time: "10:46", isMe: true }
  ]
};
