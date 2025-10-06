import React from 'react';
import { User } from '../../types';
import { Avatar } from '../avatar/Avatar';
import { AppIcons } from '../../ui/icons';
import './ContactView.scss';

interface ContactViewProps {
  user: User;
  onClose: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ user, onClose }) => {
  return (
    <div className="contact-view">
      <div className="contact-header">
        <button className="back-btn" onClick={onClose}>←</button>
        <span>Contact info</span>
        <button className="edit-btn">Edit</button>
      </div>
      
      <div className="contact-profile">
        <Avatar user={user} size={200} />
        <h2>{user.display_name}</h2>
        <p>{user.phone}</p>
      </div>
      
      <div className="contact-actions">
        <div className="action-row">
          <span className="icon"><AppIcons.Phone fontSize="small" /></span>
          <span>Call</span>
        </div>
        <div className="action-row">
          <span className="icon"><AppIcons.VideoCall fontSize="small" /></span>
          <span>Video call</span>
        </div>
        <div className="action-row">
          <span className="icon"><AppIcons.Search fontSize="small" /></span>
          <span>Search</span>
        </div>
      </div>
      
      <div className="contact-info">
        <div className="info-section">
          <h4>About</h4>
          <p>{user.about || 'Hey there! I am using PingMe.'}</p>
        </div>
        
        <div className="info-section">
          <h4>Phone</h4>
          <p>{user.phone}</p>
        </div>
      </div>
      
      <div className="contact-options">
        <div className="option-row">
          <span>Mute notifications</span>
        </div>
        <div className="option-row">
          <span>Custom notifications</span>
        </div>
        <div className="option-row">
          <span>Media visibility</span>
        </div>
      </div>
      
      <div className="danger-zone">
        <div className="option-row danger">
          <span>Block {user.display_name}</span>
        </div>
        <div className="option-row danger">
          <span>Report {user.display_name}</span>
        </div>
      </div>
    </div>
  );
};
