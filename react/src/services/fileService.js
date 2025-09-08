export function handleAttachment() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '*/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // Add file to message - placeholder for now
      const messageInput = document.querySelector('#messageInput');
      messageInput.value = `📎 ${file.name}`;
    }
  };
  input.click();
}

export function handleCamera() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';
  input.capture = 'environment';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Media captured:', file.name);
      const messageInput = document.querySelector('#messageInput');
      messageInput.value = `📷 ${file.name}`;
    }
  };
  input.click();
}
