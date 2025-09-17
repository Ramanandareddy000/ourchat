import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-context';
import './LoginPage.scss';

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginPage: React.FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.username, formData.password);
      // Navigate to the home page after successful login
      navigate('/');
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login failed', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1>Login to PingMe</h1>
        
        {error && (
          <div className="error-message general">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">UserName</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <button 
          onClick={onSwitchToRegister}
          className="switch-link"
        >
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
};