export const handleFileUpload = (accept: string, capture?: string): Promise<File | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    if (capture) input.setAttribute('capture', capture);
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };
    
    input.click();
  });
};

export const formatFileMessage = (file: File, type: 'attachment' | 'camera'): string => {
  const icon = type === 'camera' ? '📷' : '📎';
  return `${icon} ${file.name}`;
};
