export class StateManager {
  constructor() {
    this.currentChatId = null;
    this.filteredUsers = [];
    this.currentTab = 'all';
  }

  setCurrentChat(chatId) {
    this.currentChatId = chatId;
  }

  setFilteredUsers(users) {
    this.filteredUsers = users;
  }

  setCurrentTab(tab) {
    this.currentTab = tab;
  }
}

export const state = new StateManager();
