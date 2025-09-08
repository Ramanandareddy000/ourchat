import { groups } from '../../utils/data.js';

export function renderMessages(userId, userMessages) {
  const messagesContainer = document.querySelector(".messages-container");
  const isGroup = groups.find(g => g.id === userId);

  if (userMessages.length === 0) {
    messagesContainer.innerHTML = '<div class="no-chat">No messages yet</div>';
    return;
  }

  messagesContainer.innerHTML = userMessages
    .map(msg => `
      <div class="message ${msg.isMe ? "sent" : "received"}">
        <div class="message-bubble">
          ${isGroup && !msg.isMe ? `<div class="sender-name">${msg.sender}</div>` : ''}
          <div class="message-text">${msg.text}</div>
          <div class="message-time">${msg.time}</div>
        </div>
      </div>
    `)
    .join("");

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
