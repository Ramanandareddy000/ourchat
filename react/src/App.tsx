import React from 'react';
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
  return (
    <AuthProvider>
      <ChatProvider>
        <Routes>
          <Route 
            path="/login" 
            element={
              <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              <RegistrationPage />
            } 
          />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/groups" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/groups/:groupId" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/404" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={
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
