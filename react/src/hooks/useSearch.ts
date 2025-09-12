import { useState, useMemo } from 'react';
import { users, groups } from '../utils/data';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<'all' | 'online' | 'groups'>('all');

  const allUsers = useMemo(() => {
    switch (currentTab) {
      case 'online':
        return users.filter(user => user.online);
      case 'groups':
        return groups;
      default:
        return [...users, ...groups];
    }
  }, [currentTab]);

  const filteredUsers = useMemo(() => {
    return searchQuery 
      ? allUsers.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
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
