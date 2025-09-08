import { messages, groupMessages } from '../../utils/data.js';

export function ChatList(items) {
  return items
    .map(item => `
      <div class="chat-item" data-user-id="${item.id}">
        <div class="avatar">
          <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <span class="avatar-fallback">${item.avatar}</span>
        </div>
        <div class="chat-info">
          <div class="name">${item.name}</div>
          <div class="last-message">${getLastMessage(item)}</div>
        </div>
        <div class="status ${item.online ? "" : "offline"}"></div>
      </div>
    `)
    .join("");
}

function getLastMessage(item) {
  const msgs = item.isGroup ? groupMessages[item.id] : messages[item.id];
  return msgs ? msgs[msgs.length - 1].text : "No messages";
}
