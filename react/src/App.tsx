import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './modules/auth/components/login-page';
import { RegistrationPage } from './modules/Registration';
import ProtectedRoute from './components/ProtectedRoute';
import { ChatUIScreen } from './modules';
import { AuthProvider } from './modules/auth';
import { ChatProvider } from './modules/chat';
import './App.scss';

// Simple dashboard component for demonstration
const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="chat-container">
        <ChatUIScreen />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <AuthProvider>
      <ChatProvider>
        <Routes>
          <Route 
            path="/login" 
            element={
              showRegistration ? (
                <RegistrationPage onSwitchToLogin={() => setShowRegistration(false)} />
              ) : (
                <LoginPage onSwitchToRegister={() => setShowRegistration(true)} />
              )
            } 
          />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
