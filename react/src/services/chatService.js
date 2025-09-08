import { users, groups } from '../utils/data.js';

export function getUserById(id) {
  return [...users, ...groups].find(item => item.id === id);
}

export function getFilteredUsers(tab) {
  switch(tab) {
    case 'all': return [...users];
    case 'online': return users.filter(user => user.online);
    case 'groups': return [...groups];
    default: return [...users];
  }
}
