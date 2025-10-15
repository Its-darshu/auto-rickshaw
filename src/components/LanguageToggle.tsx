import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  return (
    <button 
      className="language-toggle" 
      onClick={toggleLanguage}
      aria-label="Toggle Language"
    >
      {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
    </button>
  );
};

export default LanguageToggle;