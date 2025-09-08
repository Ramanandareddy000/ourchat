export function formatTime() {
  const now = new Date();
  return now.getHours().toString().padStart(2, "0") + ":" + 
         now.getMinutes().toString().padStart(2, "0");
}

export function searchFilter(items, query) {
  return items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}
