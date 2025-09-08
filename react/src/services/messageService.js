import { messages, groupMessages, groups } from '../utils/data.js';
import { formatTime } from '../utils/helpers.js';

export function sendMessage(chatId, text) {
  if (!text || !chatId) return;

  const isGroup = groups.find(g => g.id === chatId);
  const messageStore = isGroup ? groupMessages : messages;

  if (!messageStore[chatId]) {
    messageStore[chatId] = [];
  }

  messageStore[chatId].push({
    text,
    time: formatTime(),
    isMe: true,
  });
}

export function getMessages(chatId) {
  const isGroup = groups.find(g => g.id === chatId);
  return isGroup ? (groupMessages[chatId] || []) : (messages[chatId] || []);
}
