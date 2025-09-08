import { state } from './stateManager.js';
import { searchFilter } from './helpers.js';
import { getFilteredUsers, getUserById } from '../services/chatService.js';
import { sendMessage, getMessages } from '../services/messageService.js';
import { ChatList } from '../components/chat/ChatList.js';
import { updateChatHeader } from '../components/chat/ChatHeader.js';
import { renderMessages } from '../components/chat/MessageContainer.js';

export function handleSearch(query) {
  const searchData = getFilteredUsers(state.currentTab);
  state.setFilteredUsers(searchFilter(searchData, query));
  renderChatList();
}

export function handleTabSwitch(tab) {
  state.setCurrentTab(tab);
  state.setFilteredUsers(getFilteredUsers(tab));
  renderChatList();
}

export function handleChatSelect(userId) {
  state.setCurrentChat(userId);
  const item = getUserById(userId);
  updateChatHeader(item);
  renderMessages(userId, getMessages(userId));
}

export function handleSendMessage() {
  const input = document.querySelector("#messageInput");
  const text = input.value.trim();

  if (!text || !state.currentChatId) return;

  sendMessage(state.currentChatId, text);
  input.value = "";
  renderMessages(state.currentChatId, getMessages(state.currentChatId));
  renderChatList();
}

function renderChatList() {
  const chatList = document.querySelector(".chat-list");
  chatList.innerHTML = ChatList(state.filteredUsers);
}
