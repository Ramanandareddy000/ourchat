import { showContactView } from './ContactView.js';

export function showKebabMenu() {
  const existing = document.querySelector('.kebab-menu');
  if (existing) {
    existing.remove();
    return;
  }

  const menu = document.createElement('div');
  menu.className = 'kebab-menu';
  menu.innerHTML = `
    <div class="menu-item" data-action="view-contact">View Contact</div>
    <div class="menu-item" data-action="search">Search</div>
    <div class="menu-item" data-action="new-group">New Group</div>
    <div class="menu-item" data-action="media">Media, Links, and Docs</div>
    <div class="menu-item" data-action="mute">Mute Notifications</div>
    <div class="menu-item" data-action="disappearing">Disappearing Messages</div>
    <div class="menu-item" data-action="theme">Chat Theme</div>
    <div class="menu-item" data-action="more">More <span class="arrow">▶</span></div>
  `;

  const chatHeader = document.querySelector('.chat-header');
  chatHeader.appendChild(menu);

  menu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (action === 'view-contact') {
      showContactView();
      menu.remove();
    } else if (action === 'search') {
      showMessageSearch();
      menu.remove();
    }
  });

  setTimeout(() => {
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target.id !== 'kebabBtn') {
        menu.remove();
      }
    });
  }, 0);
}

export function showMessageSearch() {
  const existing = document.querySelector('.message-search');
  if (existing) return;

  const searchBar = document.createElement('div');
  searchBar.className = 'message-search';
  searchBar.innerHTML = `
    <div class="search-header">
      <button class="close-search">×</button>
      <input type="text" placeholder="Search messages..." class="search-input" id="messageSearchInput">
    </div>
  `;

  const chatHeader = document.querySelector('.chat-header');
  chatHeader.appendChild(searchBar);

  const input = searchBar.querySelector('#messageSearchInput');
  const closeBtn = searchBar.querySelector('.close-search');

  input.focus();
  input.addEventListener('input', (e) => searchMessages(e.target.value));
  closeBtn.addEventListener('click', () => {
    searchBar.remove();
    clearMessageSearch();
  });
}

function searchMessages(query) {
  const messagesContainer = document.querySelector('.messages-container');
  const messages = messagesContainer.querySelectorAll('.message');
  
  if (!query.trim()) {
    messages.forEach(msg => msg.classList.remove('search-highlight', 'search-hidden'));
    return;
  }

  messages.forEach(msg => {
    const text = msg.querySelector('.message-text')?.textContent.toLowerCase() || '';
    if (text.includes(query.toLowerCase())) {
      msg.classList.add('search-highlight');
      msg.classList.remove('search-hidden');
    } else {
      msg.classList.remove('search-highlight');
      msg.classList.add('search-hidden');
    }
  });
}

function clearMessageSearch() {
  const messages = document.querySelectorAll('.message');
  messages.forEach(msg => msg.classList.remove('search-highlight', 'search-hidden'));
}
