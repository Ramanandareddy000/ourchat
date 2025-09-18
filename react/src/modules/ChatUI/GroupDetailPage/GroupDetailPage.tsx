import React from 'react';
import { useChat } from '../../chat';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Message } from '../../../types';
import './GroupDetailPage.scss';

export const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams();
  const { groups, messages } = useChat();
  const navigate = useNavigate();
  
  const group = groups?.find((g: User) => g.id === parseInt(groupId || '0', 10));
  const groupMessages = groupId ? messages[parseInt(groupId, 10)] || [] : [];
  
  if (!group) {
    return (
      <div className="group-detail-page">
        <button onClick={() => navigate('/groups')} className="back-btn">← Back to Groups</button>
        <p>Group not found.</p>
      </div>
    );
  }
  
  return (
    <div className="group-detail-page">
      <button onClick={() => navigate('/groups')} className="back-btn">← Back to Groups</button>
      <div className="group-header">
        <div className="group-avatar">
          {group.avatar_url || group.display_name.charAt(0)}
        </div>
        <div className="group-info">
          <h2>{group.display_name}</h2>
          <p>{group.last_seen}</p>
        </div>
      </div>
      <div className="group-messages">
        {groupMessages.length > 0 ? (
          groupMessages.map((message: Message) => (
            <div key={message.id} className={`message ${message.isMe ? 'sent' : 'received'}`}>
              {!message.isMe && <span className="sender">{message.sender}: </span>}
              <span>{message.text}</span>
            </div>
          ))
        ) : (
          <p>No messages yet. Start the conversation!</p>
        )}
      </div>
    </div>
  );
};