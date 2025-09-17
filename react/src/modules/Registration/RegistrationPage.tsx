import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import './RegistrationPage.scss';

interface RegistrationFormData {
  username: string;
  password: string;
  displayName: string;
  avatarUrl: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  displayName?: string;
  avatarUrl?: string;
  general?: string;
}

const RegistrationPage: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    password: '',
    displayName: '',
    avatarUrl: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    // Avatar URL validation (if provided)
    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setErrors({});
      
      try {
        const userData = {
          username: formData.username,
          password: formData.password,
          displayName: formData.displayName,
          avatarUrl: formData.avatarUrl || undefined,
        };
        
        await register(userData);
        // Navigate to the home page after successful registration
        navigate('/');
      } catch (error: any) {
        setErrors({
          general: error.message || 'Registration failed. Please try again.'
        });
      }
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-form-container">
        <h1>Create Account</h1>
        
        {(error || errors.general) && (
          <div className="error-message general">
            {error || errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="username">UserName</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className={errors.displayName ? 'error' : ''}
            />
            {errors.displayName && (
              <div className="error-message">{errors.displayName}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="avatarUrl">Avatar URL (optional)</label>
            <input
              id="avatarUrl"
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className={errors.avatarUrl ? 'error' : ''}
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.avatarUrl && (
              <div className="error-message">{errors.avatarUrl}</div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Register'
            )}
          </button>
        </form>
        
        <button 
          onClick={onSwitchToLogin}
          className="switch-link"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationPage;