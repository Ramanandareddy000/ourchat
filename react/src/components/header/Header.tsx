import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Header.scss";
import { useAuth } from "../../modules/auth";
import { KebabMenu } from "../dialog";


export const Header: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const menuItems = [
    {
      label: t("navigation.chats"),
      onClick: () => handleNavigation("/"),
    },
    {
      label: t("navigation.notifications"),
      onClick: () => handleNavigation("/notifications"),
    },
    {
      label: t("navigation.groups"),
      onClick: () => handleNavigation("/groups"),
    },
    { type: "divider" as const },
    {
      label: t("navigation.profile"),
      onClick: () => handleNavigation("/profile"),
    },
    {
      label: t("navigation.settings"),
      onClick: () => handleNavigation("/settings"),
    },
    { type: "divider" as const },
    {
      label: t("navigation.logout"),
      onClick: () => {
        console.log("Logout clicked");
        setIsMenuOpen(false);
      },
    },
  ];

  return (
    <div className="sidebar-header">
      <div className="header-content">
        <img src="/LOGO.svg" alt={`${t("app.name")} Logo`} className="logo" />
        <div className="app-name">
          {t("app.name")}
        </div>
      </div>

      
      {user && (
        <div className="user-info">
          <span className="welcome-text">{t("auth.welcomeBack", { name: user.display_name })}</span>
          {isMobile && (
            <KebabMenu
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
              menuItems={menuItems}
            />
          )}
        </div>
      )}
    </div>
  );
};
