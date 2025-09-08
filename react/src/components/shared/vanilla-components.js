//reusable components

export function Logo(size = 40, className = "") {
  return `
    <div class="logo ${className}" style="width: ${size}px; height: ${size}px; border-radius: 50%; overflow: hidden;">
      <img src="/LOGO.svg" alt="Chat Logo" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  `;
}

export function Button(text, variant = "primary", size = "medium", className = "", id = "") {
  return `
    <button class="btn btn--${variant} btn--${size} ${className}" ${id ? `id="${id}"` : ""}>
      ${text}
    </button>
  `;
}

export function Card(content, padding = "medium", className = "") {
  return `
    <div class="card card--${padding} ${className}">
      ${content}
    </div>
  `;
}

export function Input(type = "text", placeholder = "", id = "", className = "") {
  return `
    <input type="${type}" placeholder="${placeholder}" class="input ${className}" ${id ? `id="${id}"` : ""} autocomplete="off" />
  `;
}
