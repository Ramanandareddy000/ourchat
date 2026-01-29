import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import { AppAvatar, AppButton, AppTextInput } from '../../ui';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, Typography, Paper } from '@mui/material';
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
        <AppButton
          variant="ghost"
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </AppButton>
        <Typography variant="h5" className="profile-title">Profile</Typography>
      </div>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <AppAvatar user={user} size={100} />
        </div>

        <div className="profile-info-section">
          <div className="info-item">
            <div className="info-label">Name</div>
            {isEditingName ? (
              <div className="edit-container">
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <AppTextInput
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    size="small"
                    fullWidth
                  />
                  <AppButton
                    variant="primary"
                    size="small"
                    onClick={handleSaveName}
                  >
                    Save
                  </AppButton>
                </Box>
              </div>
            ) : (
              <div className="info-value">
                <span>{displayName}</span>
                <AppButton
                  variant="ghost"
                  size="small"
                  onClick={() => setIsEditingName(true)}
                >
                  <EditIcon fontSize="small" />
                </AppButton>
              </div>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">Status</div>
            {isEditingStatus ? (
              <div className="edit-container">
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <AppTextInput
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    size="small"
                    fullWidth
                  />
                  <AppButton
                    variant="primary"
                    size="small"
                    onClick={handleSaveStatus}
                  >
                    Save
                  </AppButton>
                </Box>
              </div>
            ) : (
              <div className="info-value">
                <span>{status || 'No status set'}</span>
                <AppButton
                  variant="ghost"
                  size="small"
                  onClick={() => setIsEditingStatus(true)}
                >
                  <EditIcon fontSize="small" />
                </AppButton>
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
          <AppButton
            variant="danger"
            onClick={logout}
            fullWidth
          >
            Logout
          </AppButton>
        </div>
      </div>
    </div>
  );
};