import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, ChatArea, VerticalIconBar } from '../../components';
import { Settings } from '../../components/sidebar/Settings';
import { Profile } from '../../components/profile/Profile';
import { useSearch } from '../../hooks';
import { useChat } from '../chat';
import { useAuth } from '../auth';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { GroupsPage } from './GroupsPage';
import { GroupDetailPage } from './GroupDetailPage';
import { NotificationsPage } from './NotificationsPage';
import { HelpPage } from './HelpPage';
import { AboutPage } from './AboutPage';
import { ErrorPage } from './ErrorPage';
import './ChatUIScreen.scss';

export const ChatUIScreen: React.FC = () => {
  const [activeIcon, setActiveIcon] = useState<'chats' | 'status' | 'groups' | 'settings' | 'profile'>('chats');
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  
  const {
    currentChatId,
    isMobile,
    chatOpen,
    contactViewOpen,
    selectedUser,
    currentMessages,
    sendMessage,
    selectChat,
    closeChat,
    openContactView,
    closeContactView
  } = useChat();

  const {
    searchQuery,
    setSearchQuery,
    currentTab,
    setCurrentTab,
    filteredUsers
  } = useSearch();

  // Get all messages for the sidebar
  const { messages } = useChat();

  const [isResizing, setIsResizing] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Handle layout resizing
  useEffect(() => {
    const resize = (e: MouseEvent) => {
      if (isResizing && mainContentRef.current) {
        const containerRect = mainContentRef.current.getBoundingClientRect();
        const sidebarContainer = mainContentRef.current.querySelector('.sidebar-container') as HTMLElement;
        
        if (sidebarContainer) {
          // Calculate new sidebar width as percentage of container width
          const newWidth = Math.max(300, Math.min(containerRect.width - 400, e.clientX - containerRect.left));
          const percentageWidth = (newWidth / containerRect.width) * 100;
          
          sidebarContainer.style.width = `${percentageWidth}%`;
        }
      }
    };

    const stopResize = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    };


    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing]);

  // Handle deep linking - when userId is in the URL, select that chat
  useEffect(() => {
    if (userId) {
      const chatId = parseInt(userId, 10);
      if (!isNaN(chatId) && chatId !== currentChatId) {
        selectChat(chatId);
      }
    }
  }, [userId, currentChatId, selectChat]);

  // Handle navigation based on URL path
  useEffect(() => {
    if (location.pathname.startsWith('/settings')) {
      setActiveIcon('settings');
    } else if (location.pathname.startsWith('/profile')) {
      setActiveIcon('profile');
    } else if (location.pathname.startsWith('/groups')) {
      setActiveIcon('groups');
    } else if (location.pathname.startsWith('/notifications')) {
      setActiveIcon('status');
    } else if (location.pathname.startsWith('/chat/')) {
      setActiveIcon('chats');
    } else {
      // Default view
      setActiveIcon('chats');
    }
  }, [location.pathname]);

  const handleIconClick = (icon: 'chats' | 'status' | 'groups' | 'settings' | 'profile') => {
    setActiveIcon(icon);
    // You can add specific logic for each icon here if needed
    switch (icon) {
      case 'chats':
        // Navigate to main chat view
        navigate('/');
        break;
      case 'status':
        // Handle status view (notifications)
        navigate('/notifications');
        break;
      case 'groups':
        // Handle groups view
        navigate('/groups');
        break;
      case 'profile':
        // Handle profile view
        navigate('/profile');
        break;
      case 'settings':
        // Handle settings view
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  // Handle chat selection with navigation
  const handleChatSelect = (userId: number) => {
    selectChat(userId);
    navigate(`/chat/${userId}`);
  };

  // Determine which page to show based on the current route
  const renderPageContent = () => {
    if (location.pathname.startsWith('/settings')) {
      return (
        <div className="settings-overlay">
          <Settings />
        </div>
      );
    }
    
    if (location.pathname.startsWith('/profile') && authUser) {
      return (
        <div className="profile-overlay">
          <Profile />
        </div>
      );
    }
    
    if (location.pathname.startsWith('/groups/')) {
      return (
        <div className="group-detail-overlay">
          <GroupDetailPage />
        </div>
      );
    }
    
    if (location.pathname.startsWith('/groups')) {
      return (
        <div className="groups-overlay">
          <GroupsPage />
        </div>
      );
    }
    
    if (location.pathname.startsWith('/notifications')) {
      return (
        <div className="notifications-overlay">
          <NotificationsPage />
        </div>
      );
    }
    
    if (location.pathname.startsWith('/help')) {
      return (
        <div className="help-overlay">
          <HelpPage />
        </div>
      );
    }
    
    if (location.pathname.startsWith('/about')) {
      return (
        <div className="about-overlay">
          <AboutPage />
        </div>
      );
    }
    
    if (location.pathname.startsWith('/404')) {
      return (
        <div className="error-overlay">
          <ErrorPage />
        </div>
      );
    }
    
    // Default is no overlay, just the main chat interface
    return null;
  };

  return (
    <div className={`chat-ui-screen ${isMobile && chatOpen ? 'chat-open' : ''}`}>
      {!isMobile && <VerticalIconBar activeIcon={activeIcon} onIconClick={handleIconClick} />}
      <div className="main-content-container" ref={mainContentRef}>
        <div className="sidebar-container">
          <Sidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            filteredUsers={filteredUsers}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            messages={messages}
          />
          {renderPageContent()}
        </div>
        
        <div 
          className="layout-resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        />
        
        <ChatArea
          selectedUser={selectedUser}
          messages={currentMessages}
          onSendMessage={sendMessage}
          onBack={closeChat}
          isMobile={isMobile}
          onViewContact={openContactView}
          contactViewOpen={contactViewOpen}
          onCloseContactView={closeContactView}
        />
      </div>
    </div>
  );
};
