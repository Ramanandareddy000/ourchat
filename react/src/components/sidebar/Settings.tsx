import React, { useEffect, useRef } from "react";
import {
  ArrowBack as BackIcon,
  Person as ProfileIcon,
  Notifications as NotificationsIcon,
  Lock as PrivacyIcon,
  Storage as StorageIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../modules/auth";
import { AppButton, AppAvatar } from "../../ui";
import { Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import "./Settings.scss";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const settingsRef = useRef<HTMLDivElement>(null);

  // Use actual user data from context
  const userProfile = user ? {
    name: user.display_name,
    status: user.about || "Available",
    avatar: user.avatar_url || user.image,
  } : {
    name: "John Doe",
    status: "Available",
    avatar: "", // In a real app, this would be a URL to the user's avatar
  };

  const settingsSections = [
    {
      id: "profile",
      title: "Profile",
      icon: <ProfileIcon />,
      items: [
        {
          id: "avatar",
          title: "Avatar",
          description: "Change your profile picture",
        },
        { id: "name", title: "Name", description: userProfile.name },
        { id: "status", title: "Status", description: userProfile.status },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <NotificationsIcon />,
      items: [
        { id: "message", title: "Message notifications", description: "On" },
        { id: "group", title: "Group notifications", description: "On" },
        { id: "call", title: "Call notifications", description: "On" },
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      icon: <PrivacyIcon />,
      items: [
        { id: "last-seen", title: "Last seen", description: "Everyone" },
        {
          id: "profile-photo",
          title: "Profile photo",
          description: "Everyone",
        },
        { id: "about", title: "About", description: "Everyone" },
        { id: "read-receipts", title: "Read receipts", description: "On" },
      ],
    },
    {
      id: "storage",
      title: "Storage and data",
      icon: <StorageIcon />,
      items: [
        { id: "storage", title: "Storage usage", description: "1.2 GB" },
        { id: "network", title: "Network usage", description: "2.4 GB" },
        {
          id: "auto-download",
          title: "Auto-download media",
          description: "Photos, Audio",
        },
      ],
    },
    {
      id: "help",
      title: "Help",
      icon: <HelpIcon />,
      items: [
        { id: "faq", title: "FAQ", description: "" },
        { id: "contact", title: "Contact us", description: "" },
        { id: "terms", title: "Terms and privacy policy", description: "" },
      ],
    },
  ];

  useEffect(() => {
    // Trigger the slide-in animation when component mounts
    setTimeout(() => {
      if (settingsRef.current) {
        settingsRef.current.classList.add("open");
      }
    }, 10);
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="settings-panel" ref={settingsRef}>
      <div className="settings-header">
        <AppButton
          variant="ghost"
          size="small"
          startIcon={<BackIcon />}
          onClick={handleBack}
        >
          Back
        </AppButton>
        <Typography variant="h5">Settings</Typography>
      </div>

      <div className="settings-content">
        {/* Profile Section */}
        <div className="settings-section profile-section">
          <div className="profile-header">
            <div className="profile-avatar">
              {user ? (
                <AppAvatar user={user} size={64} />
              ) : (
                <AppAvatar user={{} as any} size={64} />
              )}
            </div>
            <div className="profile-info">
              <Typography variant="h6">{userProfile.name}</Typography>
              <Typography variant="body2" color="text.secondary">{userProfile.status}</Typography>
            </div>
          </div>
        </div>

        {/* Other Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.id} className="settings-section">
            <div className="section-header">
              <div className="section-icon">{section.icon}</div>
              <Typography variant="h6">{section.title}</Typography>
            </div>
            <div className="section-items">
              {section.items.map((item) => (
                <div key={item.id} className="settings-item">
                  <div className="item-content">
                    <Typography variant="body1">{item.title}</Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                    )}
                  </div>
                  <ChevronRightIcon color="action" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="settings-section logout-section">
          <AppButton
            variant="danger"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
          >
            Logout
          </AppButton>
        </div>
      </div>
    </div>
  );
};
