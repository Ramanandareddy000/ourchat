import React from 'react';
import './NotificationsPage.scss';

export const NotificationsPage: React.FC = () => {
  // In a real app, this would fetch notifications from an API
  const notifications = [
    { id: 1, text: "Alice sent you a message", time: "2 minutes ago", read: false },
    { id: 2, text: "You've been added to Team Alpha group", time: "1 hour ago", read: true },
    { id: 3, text: "Bob liked your message", time: "3 hours ago", read: true },
    { id: 4, text: "New login detected from a new device", time: "5 hours ago", read: false },
    { id: 5, text: "Your profile picture has been updated", time: "1 day ago", read: true },
    { id: 6, text: "Welcome to OursChat! Get started by adding contacts", time: "2 days ago", read: true }
  ];
  
  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <button className="mark-all-read">Mark all as read</button>
      </div>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
          >
            <div className="notification-content">
              <p>{notification.text}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {!notification.read && <div className="unread-indicator" />}
          </div>
        ))}
      </div>
    </div>
  );
};