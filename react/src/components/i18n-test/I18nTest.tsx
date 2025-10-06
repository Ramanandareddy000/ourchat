import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher';
import './I18nTest.scss';

export const I18nTest: React.FC = () => {
  const { t, i18n } = useTranslation();

  const testKeys = [
    'app.name',
    'app.welcomeMessage',
    'app.selectChatMessage',
    'navigation.chats',
    'navigation.notifications',
    'navigation.groups',
    'auth.loginTitle',
    'auth.username',
    'auth.password',
    'chat.typeMessage',
    'chat.searchChats',
    'chat.addParticipant',
    'language.select',
    'language.english',
    'language.telugu'
  ];

  return (
    <div className="i18n-test">
      <div className="test-header">
        <h1>🌏 Internationalization Test</h1>
        <p>Current Language: <strong>{i18n.language}</strong></p>
        <LanguageSwitcher />
      </div>

      <div className="test-content">
        <div className="test-section">
          <h2>📱 App Strings</h2>
          <div className="test-grid">
            {testKeys.map((key) => (
              <div key={key} className="test-item">
                <div className="test-key">{key}</div>
                <div className="test-value">{t(key)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="test-section">
          <h2>✨ Multilingual Font Rendering Test</h2>
          <div className="font-test">
            <div className="test-text">
              <h3>Telugu Sample Text:</h3>
              <p className="telugu-text large">
                నమస్కారం! పింగ్‌మీకి స్వాగతం. ఇది తెలుగు భాష పరీక్ష.
              </p>
              <p className="telugu-text">
                వినియోగదారు పేరు, పాస్‌వర్డ్, సందేశం టైప్ చేయండి
              </p>
              <p className="telugu-text small">
                చాట్‌లు, నోటిఫికేషన్‌లు, గ్రూప్‌లు, ప్రొఫైల్, సెట్టింగ్‌లు
              </p>
            </div>

            <div className="test-text">
              <h3>Hindi Sample Text:</h3>
              <p className="hindi-text large">
                नमस्ते! पिंगमी में आपका स्वागत है। यह हिंदी भाषा परीक्षण है।
              </p>
              <p className="hindi-text">
                उपयोगकर्ता नाम, पासवर्ड, संदेश टाइप करें
              </p>
              <p className="hindi-text small">
                चैट्स, सूचनाएं, समूह, प्रोफ़ाइल, सेटिंग्स
              </p>
            </div>

            <div className="test-text">
              <h3>Mixed Content (Current Language):</h3>
              <p className="mixed-text">
                Welcome to {t('app.name')} - {t('app.welcomeMessage')}
              </p>
              <p className="mixed-text">
                Current language: {i18n.language === 'te' ? t('language.telugu') :
                                  i18n.language === 'hi' ? t('language.hindi') :
                                  t('language.english')} ({i18n.language.toUpperCase()})
              </p>
            </div>
          </div>
        </div>

        <div className="test-section">
          <h2>🎨 UI Component Test</h2>
          <div className="component-test">
            <div className="mock-login">
              <h3>{t('auth.loginTitle')}</h3>
              <div className="form-group">
                <label>{t('auth.username')}</label>
                <input type="text" placeholder={t('auth.username')} />
              </div>
              <div className="form-group">
                <label>{t('auth.password')}</label>
                <input type="password" placeholder={t('auth.password')} />
              </div>
              <button>{t('auth.login')}</button>
            </div>

            <div className="mock-chat">
              <div className="chat-header">
                <span>{t('navigation.chats')}</span>
              </div>
              <div className="search-bar">
                <input type="text" placeholder={t('chat.searchChats')} />
              </div>
              <div className="chat-input">
                <input type="text" placeholder={t('chat.typeMessage')} />
                <button>{t('chat.sendMessage')}</button>
              </div>
            </div>
          </div>
        </div>

        <div className="test-section">
          <h2>🔄 Direction Test (Future RTL Support)</h2>
          <div className="direction-test">
            <p>Current Direction: <strong>{document.dir || 'ltr'}</strong></p>
            <div className="rtl-preview">
              <p>This will automatically flip for RTL languages like Arabic</p>
              <div className="message-preview sent">Sent message</div>
              <div className="message-preview received">Received message</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};