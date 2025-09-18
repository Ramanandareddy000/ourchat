import authService from '../services/authService';

export const handleLogout = () => {
  authService.logout();
  window.location.href = '/login';
};