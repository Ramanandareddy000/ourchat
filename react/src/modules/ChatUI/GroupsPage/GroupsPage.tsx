import React from 'react';
import { useChat } from '../../chat';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types';
import './GroupsPage.scss';

export const GroupsPage: React.FC = () => {
  const { groups } = useChat();
  const navigate = useNavigate();
  
  const handleGroupSelect = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };
  
  return (
    <div className="groups-page">
      <h2>Online Groups</h2>
      <div className="groups-list">
        {groups && groups.length > 0 ? (
          groups.map((group: User) => (
            <div 
              key={group.id} 
              className="group-item"
              onClick={() => handleGroupSelect(group.id)}
            >
              <div className="group-avatar">
                {group.avatar_url || group.display_name.charAt(0)}
              </div>
              <div className="group-info">
                <h3>{group.display_name}</h3>
                <p>{group.last_seen}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No groups available. Create a new group to get started!</p>
        )}
      </div>
      <button className="create-group-btn">Create New Group</button>
    </div>
  );
};