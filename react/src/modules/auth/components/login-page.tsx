import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../auth-context';
import { AppContainer, FormField, AppButton, ErrorMessage } from '../../../ui';
import { LanguageSwitcher } from '../../../components/language-switcher';

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const { login, isLoading, error } = useAuth();

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
      // Navigation is now handled in the auth context
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login failed', err);
    }
  };

  return (
    <AppContainer maxWidth="sm" centered fullHeight>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <LanguageSwitcher />
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[3],
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {t("auth.loginTitle")}
        </Typography>

        {error && (
          <ErrorMessage message={error} sx={{ mb: 2 }} />
        )}

        <FormField
          name="username"
          label={t("auth.username")}
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <FormField
          name="password"
          label={t("auth.password")}
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <AppButton
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        >
          {t('auth.login')}
        </AppButton>

        <Typography align="center">
          <Link
            to="/register"
            style={{
              color: 'inherit',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {t("auth.loginPrompt")}
          </Link>
        </Typography>
      </Box>
    </AppContainer>
  );
};