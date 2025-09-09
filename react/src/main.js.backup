import "./styles/main.scss";
import { users } from "./utils/data.js";
import { Logo, Button, Input } from "./components/shared/vanilla-components.js";
import { state } from "./utils/stateManager.js";
import { ChatList } from "./components/chat/ChatList.js";
import { handleSearch, handleTabSwitch, handleChatSelect, handleSendMessage } from "./utils/eventHandlers.js";
import { handleAttachment, handleCamera } from "./services/fileService.js";
import { showEmojiPicker } from "./components/ui/EmojiPicker.js";
import { showKebabMenu } from "./components/ui/KebabMenu.js";
import { showContactView } from "./components/ui/ContactView.js";

// Initialize state
state.setFilteredUsers([...users]);

function renderChatList() {
  const chatList = document.querySelector(".chat-list");
  chatList.innerHTML = ChatList(state.filteredUsers);
}

// Render main app
document.querySelector("#app").innerHTML = `
  <div class="sidebar">
    <div class="sidebar-header">
      ${Logo(44, "header-logo")}
      <span class="app-name pingme-text">Ping<span class="accent">Me</span></span>
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
      <div class="header-left">
        <button class="back-btn" id="backBtn">←</button>
        <div class="contact-info">
          <div class="avatar" id="chatAvatar"></div>
          <div class="contact-details">
            <h3 id="chatName">Select a chat</h3>
            <span id="chatStatus">Click on a contact to start messaging</span>
          </div>
        </div>
      </div>
      <div class="chat-actions">
        ${Button("📞", "secondary", "small", "action-btn", "callBtn")}
        ${Button("📹", "secondary", "small", "action-btn", "videoBtn")}
        ${Button("⋮", "secondary", "small", "action-btn", "kebabBtn")}
      </div>
    </div>
    
    <div class="messages-container">
      <div class="no-chat">Select a chat to start messaging</div>
    </div>
    
    <div class="message-input">
      <div class="input-container">
        <button class="action-btn emoji-btn" id="emojiBtn">😊</button>
        ${Input("text", "Type a message", "messageInput")}
        <button class="action-btn attach-btn" id="attachBtn">📎</button>
        <button class="action-btn camera-btn" id="cameraBtn">📷</button>
      </div>
      <button class="send-btn" id="sendButton">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  </div>
`;

renderChatList();

// Event listeners
document.querySelector("#searchInput").addEventListener("input", (e) => {
  handleSearch(e.target.value);
});

document.querySelectorAll(".nav-tab").forEach((tab) => {
  tab.addEventListener("click", (e) => {
    document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
    e.target.classList.add("active");
    handleTabSwitch(e.target.dataset.tab);
  });
});

document.addEventListener("click", (e) => {
  const chatItem = e.target.closest(".chat-item");
  if (chatItem) {
    document.querySelectorAll(".chat-item").forEach((item) => item.classList.remove("active"));
    chatItem.classList.add("active");
    handleChatSelect(parseInt(chatItem.dataset.userId));
    
    // Mobile: Show chat area
    if (window.innerWidth <= 768) {
      document.querySelector("#app").classList.add("chat-open");
    }
  }
});

document.querySelector("#sendButton").addEventListener("click", handleSendMessage);
document.querySelector("#messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSendMessage();
});

// New button event listeners
document.querySelector("#attachBtn").addEventListener("click", handleAttachment);
document.querySelector("#cameraBtn").addEventListener("click", handleCamera);
document.querySelector("#emojiBtn").addEventListener("click", showEmojiPicker);
document.querySelector("#kebabBtn").addEventListener("click", showKebabMenu);

// Mobile back button
document.querySelector("#backBtn").addEventListener("click", () => {
  document.querySelector("#app").classList.remove("chat-open");
});

// Mobile keyboard handling
const messageInput = document.querySelector("#messageInput");
let initialViewportHeight = window.innerHeight;

messageInput.addEventListener("focus", () => {
  if (window.innerWidth <= 768) {
    document.body.classList.add("keyboard-open");
    // Add visual keyboard simulation for dev tools
    if (!document.querySelector('.dev-keyboard')) {
      const devKeyboard = document.createElement('div');
      devKeyboard.className = 'dev-keyboard';
      devKeyboard.innerHTML = 'Virtual Keyboard (Dev Tools)';
      document.body.appendChild(devKeyboard);
    }
    // Scroll to input when keyboard opens
    setTimeout(() => {
      messageInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }
});

messageInput.addEventListener("blur", () => {
  if (window.innerWidth <= 768) {
    document.body.classList.remove("keyboard-open");
    // Remove visual keyboard simulation
    const devKeyboard = document.querySelector('.dev-keyboard');
    if (devKeyboard) devKeyboard.remove();
  }
});

// Handle viewport changes for keyboard
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    const currentHeight = window.innerHeight;
    if (currentHeight < initialViewportHeight * 0.75) {
      document.body.classList.add("keyboard-open");
    } else {
      document.body.classList.remove("keyboard-open");
    }
  }
});
