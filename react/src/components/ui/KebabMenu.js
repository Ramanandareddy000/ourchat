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

  setTimeout(() => {
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target.id !== 'kebabBtn') {
        menu.remove();
      }
    });
  }, 0);
}
