export function updateChatHeader(item) {
  const chatName = document.querySelector("#chatName");
  const chatStatus = document.querySelector("#chatStatus");
  const chatAvatar = document.querySelector("#chatAvatar");

  chatName.textContent = item.name;
  chatStatus.textContent = item.lastSeen;
  chatAvatar.innerHTML = `
    <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
    <span class="avatar-fallback">${item.avatar}</span>
  `;
}
