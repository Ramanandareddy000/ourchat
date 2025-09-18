import React, { useEffect, useRef } from "react";
import {
  ArrowBack as BackIcon,
  Person as ProfileIcon,
  Notifications as NotificationsIcon,
  Lock as PrivacyIcon,
  Storage as StorageIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../modules/auth";
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
        <button className="back-button" onClick={handleBack}>
          <BackIcon />
        </button>
        <h2>Settings</h2>
      </div>

      <div className="settings-content">
        {/* Profile Section */}
        <div className="settings-section profile-section">
          <div className="profile-header">
            <div className="profile-avatar">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  <ProfileIcon />
                </div>
              )}
            </div>
            <div className="profile-info">
              <h3>{userProfile.name}</h3>
              <p>{userProfile.status}</p>
            </div>
          </div>
        </div>

        {/* Other Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.id} className="settings-section">
            <div className="section-header">
              <div className="section-icon">{section.icon}</div>
              <h3>{section.title}</h3>
            </div>
            <div className="section-items">
              {section.items.map((item) => (
                <div key={item.id} className="settings-item">
                  <div className="item-content">
                    <div className="item-title">{item.title}</div>
                    {item.description && (
                      <div className="item-description">{item.description}</div>
                    )}
                  </div>
                  <div className="item-arrow">›</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="settings-section logout-section">
          <div className="settings-item logout-item" onClick={handleLogout}>
            <div className="item-content">
              <div className="item-title">Logout</div>
            </div>
            <div className="item-icon">
              <LogoutIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
