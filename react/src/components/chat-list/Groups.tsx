import React from 'react';
import { User } from '../../types';
import { Avatar } from '../avatar/Avatar';
import './Groups.scss';

interface GroupsProps {
  groups: User[];
  currentChatId: number | null;
  onChatSelect: (groupId: number) => void;
  messages: Record<number, any[]>;
}

export const Groups: React.FC<GroupsProps> = ({
  groups,
  currentChatId,
  onChatSelect,
  messages
}) => {
  // Filter to ensure we only show actual groups
  const actualGroups = groups.filter(group => group.is_group);

  return (
    <div className="groups-list">
      {actualGroups.map((group) => {
        // Get last message for the group
        const lastMessage = messages[group.id]?.length 
          ? messages[group.id][messages[group.id].length - 1] 
          : null;
          
        // Format last message text
        const lastMessageText = lastMessage 
          ? lastMessage.sender 
            ? `${lastMessage.sender}: ${lastMessage.text}` 
            : lastMessage.text
          : group.last_seen; // Show member count if no messages

        return (
          <div
            key={group.id}
            className={`group-item ${currentChatId === group.id ? 'active' : ''}`}
            onClick={() => onChatSelect(group.id)}
          >
            <div className="avatar-container">
              <Avatar user={group} size={49} />
            </div>
            <div className="group-info">
              <div className="group-header">
                <div className="group-name">{group.display_name}</div>
                {lastMessage && (
                  <div className="last-message-time">{lastMessage.time}</div>
                )}
              </div>
              <div className="group-footer">
                <div className="last-message">{lastMessageText}</div>
                <div className="group-icons">
                  {/* Group icons will be added based on actual group properties */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};