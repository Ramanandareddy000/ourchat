import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth';
import { LanguageSwitcher } from '../../components/language-switcher';
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

const RegistrationPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    password: '',
    displayName: '',
    avatarUrl: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { register, isLoading, error } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = t('auth.validation.usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('auth.validation.usernameMinLength');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('auth.validation.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.validation.passwordMinLength');
    }

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = t('auth.validation.displayNameRequired');
    }

    // Avatar URL validation (if provided)
    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = t('auth.validation.invalidUrl');
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
        // Navigation will be handled by auth context
      } catch (error: any) {
        setErrors({
          general: error.message || t('auth.registrationFailed')
        });
      }
    }
  };

  return (
    <div className="registration-page">
      <div className="language-switcher-container">
        <LanguageSwitcher />
      </div>
      <div className="registration-form-container">
        <h1>{t('auth.register')}</h1>
        
        {(error || errors.general) && (
          <div className="error-message general">
            {error || errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="username">{t('auth.username')}</label>
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
            <label htmlFor="password">{t('auth.password')}</label>
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
            <label htmlFor="displayName">{t('auth.displayName')}</label>
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
            <label htmlFor="avatarUrl">{t('auth.avatar_url')}</label>
            <input
              id="avatarUrl"
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className={errors.avatarUrl ? 'error' : ''}
              placeholder={t('auth.avatarPlaceholder')}
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
              t('auth.register')
            )}
          </button>
        </form>
        
        <div className="switch-link">
          <Link to="/login">
            {t('auth.alreadyHaveAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;