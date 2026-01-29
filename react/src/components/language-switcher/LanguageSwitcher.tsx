import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import './LanguageSwitcher.scss';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { t } = useTranslation();
  const {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    isChangingLanguage,
    i18n
  } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`language-switcher ${className || ''}`}>
      <button
        className="language-trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChangingLanguage}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="current-language">
          {currentLanguage.nativeName}
        </span>
        <span className="dropdown-arrow">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="language-dropdown" role="listbox">
          <div className="dropdown-header">
            {t('language.select')}
          </div>
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${
                i18n.language === language.code ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
              role="option"
              aria-selected={i18n.language === language.code}
            >
              <span className="language-native">{language.nativeName}</span>
              <span className="language-english">({language.name})</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="language-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};