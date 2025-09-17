import { logout } from '../services/authService';

export const handleLogout = () => {
  logout();
  window.location.href = '/login';
};