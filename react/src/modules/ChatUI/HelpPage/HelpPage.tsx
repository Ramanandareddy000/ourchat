import React from 'react';

export const HelpPage: React.FC = () => (
  <div className="help-page">
    <h2>Help & Support</h2>
    <div className="help-sections">
      <div className="help-section">
        <h3>Getting Started</h3>
        <ul>
          <li>How to create an account</li>
          <li>How to add contacts</li>
          <li>How to start a conversation</li>
        </ul>
      </div>
      <div className="help-section">
        <h3>Groups</h3>
        <ul>
          <li>How to create a group</li>
          <li>How to add members to a group</li>
          <li>How to leave a group</li>
        </ul>
      </div>
      <div className="help-section">
        <h3>Account Settings</h3>
        <ul>
          <li>How to change your profile picture</li>
          <li>How to update your password</li>
          <li>How to delete your account</li>
        </ul>
      </div>
    </div>
  </div>
);