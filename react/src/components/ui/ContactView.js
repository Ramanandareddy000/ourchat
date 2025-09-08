import { users, groups } from '../../utils/data.js';
import { state } from '../../utils/stateManager.js';

export function showContactView() {
  if (!state.currentChatId) return;
  
  const contact = [...users, ...groups].find(u => u.id === state.currentChatId);
  if (!contact) return;

  const existing = document.querySelector('.contact-view-modal');
  if (existing) {
    existing.remove();
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'contact-view-modal';
  modal.innerHTML = `
    <div class="contact-view-content">
      <div class="contact-view-header">
        <button class="close-contact-view">×</button>
        <h3>Contact Info</h3>
      </div>
      
      <div class="contact-profile">
        <div class="contact-avatar-large">
          <img src="${contact.image}" alt="${contact.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <span class="avatar-fallback-large">${contact.avatar}</span>
        </div>
        <h2 class="contact-name">${contact.name}</h2>
        <p class="contact-status">${contact.lastSeen}</p>
        ${contact.phone ? `<p class="contact-phone">${contact.phone}</p>` : ''}
      </div>

      <div class="contact-actions">
        <button class="contact-action-btn">
          <span class="action-icon">📞</span>
          <span>Audio</span>
        </button>
        <button class="contact-action-btn">
          <span class="action-icon">📹</span>
          <span>Video</span>
        </button>
        <button class="contact-action-btn">
          <span class="action-icon">🔍</span>
          <span>Search</span>
        </button>
      </div>

      <div class="contact-info-section">
        <div class="section-header">About and phone number</div>
        ${contact.phone ? `
        <div class="contact-detail">
          <span class="detail-icon">📞</span>
          <div class="detail-content">
            <div class="detail-value">${contact.phone}</div>
            <div class="detail-label">Mobile</div>
          </div>
        </div>
        ` : ''}
        <div class="contact-detail">
          <span class="detail-icon">ℹ️</span>
          <div class="detail-content">
            <div class="detail-value">Hey there! I am using PingMe.</div>
            <div class="detail-label">About</div>
          </div>
        </div>
      </div>

      <div class="contact-options">
        <div class="contact-option">
          <span class="option-icon">📎</span>
          <span class="option-text">Media, links, and docs</span>
          <span class="option-toggle">></span>
        </div>
        <div class="contact-option">
          <span class="option-icon">🔔</span>
          <span class="option-text">Mute notifications</span>
          <span class="option-toggle">></span>
        </div>
        <div class="contact-option">
          <span class="option-icon">⏰</span>
          <span class="option-text">Disappearing messages</span>
          <span class="option-toggle">Off ></span>
        </div>
        <div class="contact-option">
          <span class="option-icon">🔒</span>
          <span class="option-text">Encryption</span>
          <div class="option-description">
            <div>Messages are end-to-end encrypted. Click to verify.</div>
          </div>
        </div>
      </div>

      <div class="contact-danger-zone">
        <div class="contact-option danger">
          <span class="option-icon">🚫</span>
          <span class="option-text">Block ${contact.name}</span>
        </div>
        <div class="contact-option danger">
          <span class="option-icon">👎</span>
          <span class="option-text">Report ${contact.name}</span>
        </div>
        <div class="contact-option danger">
          <span class="option-icon">🗑️</span>
          <span class="option-text">Delete chat</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('.close-contact-view');
  closeBtn.addEventListener('click', () => modal.remove());

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}
