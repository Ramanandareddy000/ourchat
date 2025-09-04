import "./style.scss";
import { users, messages } from "../utils/data.js";
import { Logo, Button, Card, Input } from "./components/vanilla-components.js";

let currentChatId = null;
let filteredUsers = [...users];

function renderChatList() {
  const chatList = document.querySelector(".chat-list");
  chatList.innerHTML = filteredUsers
    .map(
      (user) => `
    <div class="chat-item" data-user-id="${user.id}">
      <div class="avatar">
        <img src="${user.image}" alt="${
        user.name
      }" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <span class="avatar-fallback">${user.avatar}</span>
      </div>
      <div class="chat-info">
        <div class="name">${user.name}</div>
        <div class="last-message">${
          messages[user.id]
            ? messages[user.id][messages[user.id].length - 1].text
            : "No messages"
        }</div>
      </div>
      <div class="status ${user.online ? "" : "offline"}"></div>
    </div>
  `
    )
    .join("");
}

function searchUsers(query) {
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );
  renderChatList();
}

function renderMessages(userId) {
  const messagesContainer = document.querySelector(".messages-container");
  const userMessages = messages[userId] || [];

  if (userMessages.length === 0) {
    messagesContainer.innerHTML = '<div class="no-chat">No messages yet</div>';
    return;
  }

  messagesContainer.innerHTML = userMessages
    .map(
      (msg) => `
    <div class="message ${msg.isMe ? "sent" : "received"}">
      <div class="message-bubble">
        <div class="message-text">${msg.text}</div>
        <div class="message-time">${msg.time}</div>
      </div>
    </div>
  `
    )
    .join("");

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateChatHeader(user) {
  const chatName = document.querySelector("#chatName");
  const chatStatus = document.querySelector("#chatStatus");
  const chatAvatar = document.querySelector("#chatAvatar");

  chatName.textContent = user.name;
  chatStatus.textContent = user.lastSeen;
  chatAvatar.innerHTML = `
    <img src="${user.image}" alt="${user.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
    <span class="avatar-fallback">${user.avatar}</span>
  `;
}

function sendMessage() {
  const input = document.querySelector("#messageInput");
  const text = input.value.trim();

  if (!text || !currentChatId) return;

  if (!messages[currentChatId]) {
    messages[currentChatId] = [];
  }

  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  messages[currentChatId].push({
    text,
    time,
    isMe: true,
  });

  input.value = "";
  renderMessages(currentChatId);
  renderChatList();
}

document.querySelector("#app").innerHTML = `
  <div class="sidebar">
    <div class="sidebar-header">
      ${Logo(44, "header-logo")}
      <span class="app-name">ourschat</span>
    </div>
    <div class="search-container">
      ${Input("text", "Search chats...", "searchInput", "search-input")}
    </div>
    <div class="nav-tabs">
      <button class="nav-tab active" data-tab="all">All</button>
      <button class="nav-tab" data-tab="online">Online</button>
      <button class="nav-tab" data-tab="groups">Groups</button>
    </div>
    <div class="chat-list"></div>
  </div>
  
  <div class="chat-area">
    <div class="chat-header">
      <div class="contact-info">
        <div class="avatar" id="chatAvatar"></div>
        <div class="contact-details">
          <h3 id="chatName">Select a chat</h3>
          <span id="chatStatus">Click on a contact to start messaging</span>
        </div>
      </div>
      <div class="chat-actions">
        ${Button("📞", "secondary", "small", "action-btn")}
        ${Button("📹", "secondary", "small", "action-btn")}
        ${Button("⋮", "secondary", "small", "action-btn")}
      </div>
    </div>
    
    <div class="messages-container">
      <div class="no-chat">Select a chat to start messaging</div>
    </div>
    
    <div class="message-input">
      ${Input("text", "Type a message", "messageInput")}
      ${Button("Send", "primary", "medium", "", "sendButton")}
    </div>
  </div>
`;

renderChatList();

// Search functionality
document.querySelector("#searchInput").addEventListener("input", (e) => {
  searchUsers(e.target.value);
});

// Navigation tabs
document.querySelectorAll(".nav-tab").forEach((tab) => {
  tab.addEventListener("click", (e) => {
    document
      .querySelectorAll(".nav-tab")
      .forEach((t) => t.classList.remove("active"));
    e.target.classList.add("active");

    const tabType = e.target.dataset.tab;
    if (tabType === "all") {
      filteredUsers = [...users];
    } else if (tabType === "online") {
      filteredUsers = users.filter((user) => user.online);
    } else if (tabType === "groups") {
      filteredUsers = []; 
    }
    renderChatList();
  });
});

document.addEventListener("click", (e) => {
  const chatItem = e.target.closest(".chat-item");
  if (chatItem) {
    document
      .querySelectorAll(".chat-item")
      .forEach((item) => item.classList.remove("active"));
    chatItem.classList.add("active");

    const userId = parseInt(chatItem.dataset.userId);
    currentChatId = userId;

    const user = users.find((u) => u.id === userId);
    updateChatHeader(user);
    renderMessages(userId);
  }
});

document.querySelector("#sendButton").addEventListener("click", sendMessage);
document.querySelector("#messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
