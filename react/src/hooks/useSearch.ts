import { useState, useMemo } from 'react';
import { useChat } from '../modules/chat';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<'all' | 'online' | 'groups'>('all');
  const { users, groups } = useChat();

  const allUsers = useMemo(() => {
    switch (currentTab) {
      case 'online':
        return users.filter(user => user.online);
      case 'groups':
        return groups;
      default:
        return users; // Only return users for "all" tab, groups are handled separately
    }
  }, [currentTab, users, groups]);

  const filteredUsers = useMemo(() => {
    return searchQuery 
      ? allUsers.filter(user => 
          user.display_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allUsers;
  }, [allUsers, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    currentTab,
    setCurrentTab,
    filteredUsers
  };
};
