// API service for fetching data from the backend
import messageService from '../../services/messageService';

// Export all services from the new centralized service
export const fetchUsers = messageService.fetchUsers;
export const fetchConversations = messageService.fetchConversations;
export const fetchMessages = messageService.fetchMessages;
export const fetchMessagesByConversationId = messageService.fetchMessagesByConversationId;
export const createMessage = messageService.createMessage;
export const updateMessage = messageService.updateMessage;
export const deleteMessage = messageService.deleteMessage;