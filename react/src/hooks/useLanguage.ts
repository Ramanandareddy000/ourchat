import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL?: boolean;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
];

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Get current language info
  const getCurrentLanguage = useCallback((): Language => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language) || SUPPORTED_LANGUAGES[0];
  }, [i18n.language]);

  // Detect user's preferred language from browser/system
  const detectUserLanguage = useCallback((): string => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
      return savedLanguage;
    }

    // Check browser language
    const browserLanguage = navigator.language.toLowerCase();
    const languageCode = browserLanguage.split('-')[0];

    if (SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
      return languageCode;
    }

    // Check browser languages array
    for (const browserLang of navigator.languages) {
      const code = browserLang.toLowerCase().split('-')[0];
      if (SUPPORTED_LANGUAGES.some(lang => lang.code === code)) {
        return code;
      }
    }

    return 'en'; // Default fallback
  }, []);

  // Change language with RTL support
  const changeLanguage = useCallback(async (languageCode: string) => {
    if (!SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
      console.warn(`Unsupported language: ${languageCode}`);
      return;
    }

    setIsChangingLanguage(true);

    try {
      await i18n.changeLanguage(languageCode);

      // Handle RTL/LTR direction
      const isRTL = RTL_LANGUAGES.includes(languageCode);
      const direction = isRTL ? 'rtl' : 'ltr';

      document.dir = direction;
      document.documentElement.setAttribute('dir', direction);
      document.documentElement.setAttribute('lang', languageCode);

      // Save to localStorage (i18next should handle this automatically, but just in case)
      localStorage.setItem('i18nextLng', languageCode);

      // Dispatch custom event for other components that might need to respond
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: languageCode, direction }
      }));

    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChangingLanguage(false);
    }
  }, [i18n]);

  // Initialize language on mount
  useEffect(() => {
    const detectedLanguage = detectUserLanguage();
    if (detectedLanguage !== i18n.language) {
      changeLanguage(detectedLanguage);
    }
  }, []); // Only run on mount

  // Set up document attributes when language changes
  useEffect(() => {
    const currentLang = i18n.language;
    const isRTL = RTL_LANGUAGES.includes(currentLang);
    const direction = isRTL ? 'rtl' : 'ltr';

    document.dir = direction;
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', currentLang);

    // Add language-specific CSS classes
    document.documentElement.className = document.documentElement.className
      .replace(/\blang-\w+\b/g, '') // Remove existing lang- classes
      .replace(/\s+/g, ' ') // Clean up spaces
      .trim();
    document.documentElement.classList.add(`lang-${currentLang}`);

    if (isRTL) {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [i18n.language]);

  return {
    currentLanguage: getCurrentLanguage(),
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
    isChangingLanguage,
    isRTL: RTL_LANGUAGES.includes(i18n.language),
    t,
    i18n
  };
};