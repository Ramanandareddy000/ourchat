async function fetchEmojis() {
  const response = await fetch("https://emojihub.yurace.pro/api/all/category/smileys-and-people");
  return await response.json();
}

export async function showEmojiPicker() {
  const existing = document.querySelector('.emoji-picker-container');
  if (existing) {
    existing.remove();
    return;
  }

  const container = document.createElement('div');
  container.className = 'emoji-picker-container';
  container.innerHTML = '<div class="loading">Loading emojis...</div>';
  
  const messageInput = document.querySelector('.message-input');
  messageInput.appendChild(container);

  try {
    const emojis = await fetchEmojis();
    
    container.innerHTML = `
      <div class="emoji-grid">
        ${emojis.map(emoji => `<span class="emoji-item" data-emoji="${emoji.htmlCode[0]}" title="${emoji.name}">${emoji.htmlCode[0]}</span>`).join('')}
      </div>
    `;

    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('emoji-item')) {
        const input = document.querySelector('#messageInput');
        input.value += e.target.dataset.emoji;
        input.focus();
        container.remove();
      }
    });

  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load emojis</div>';
  }

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target) && !e.target.closest('#emojiBtn')) {
      container.remove();
    }
  }, { once: true });
}
