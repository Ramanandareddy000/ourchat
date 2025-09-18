import React, { useState } from 'react';
import { Avatar } from '../avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import './Profile.scss';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || user?.username || '');
  const [status, setStatus] = useState(user?.about || '');

  if (!user) {
    return null;
  }

  const handleSaveName = () => {
    // In a real app, this would call an API to update the user
    console.log('Updating name:', displayName);
    setIsEditingName(false);
  };

  const handleSaveStatus = () => {
    // In a real app, this would call an API to update the user
    console.log('Updating status:', status);
    setIsEditingStatus(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="profile-panel">
      <div className="profile-header">
        <button className="back-button" onClick={handleBack}>
          ←
        </button>
        <h2 className="profile-title">Profile</h2>
      </div>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <Avatar user={user} size={100} />
        </div>

        <div className="profile-info-section">
          <div className="info-item">
            <div className="info-label">Name</div>
            {isEditingName ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="edit-input"
                />
                <button className="save-button" onClick={handleSaveName}>
                  Save
                </button>
              </div>
            ) : (
              <div className="info-value">
                <span>{displayName}</span>
                <button className="edit-button" onClick={() => setIsEditingName(true)}>
                  ✏️
                </button>
              </div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">Status</div>
            {isEditingStatus ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="edit-input"
                />
                <button className="save-button" onClick={handleSaveStatus}>
                  Save
                </button>
              </div>
            ) : (
              <div className="info-value">
                <span>{status || 'No status set'}</span>
                <button className="edit-button" onClick={() => setIsEditingStatus(true)}>
                  ✏️
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="account-info-section">
          <h3 className="section-title">Account Information</h3>
          <div className="info-item">
            <div className="info-label">Username</div>
            <div className="info-value">{user.username}</div>
          </div>
          {user.phone && (
            <div className="info-item">
              <div className="info-label">Phone</div>
              <div className="info-value">{user.phone}</div>
            </div>
          )}
          <div className="info-item">
            <div className="info-label">Email</div>
            <div className="info-value">{user.username}</div>
          </div>
        </div>

        <div className="logout-section">
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};