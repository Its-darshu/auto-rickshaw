import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose}
        />
      )}
      
      {/* Figma Sidebar */}
      <div className={`figma-sidebar ${isOpen ? 'figma-sidebar-open' : ''}`}>
        {/* Close Button */}
        <button 
          className="figma-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.5 8.5L8.5 25.5M8.5 8.5L25.5 25.5" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Language Toggle Button */}
        <button 
          className="figma-language-btn"
          onClick={toggleLanguage}
        >
          <span className="figma-language-text">
            {language === 'en' ? 'Translate to ಕನ್ನಡ' : 'Switch to English'}
          </span>
        </button>

        {/* Developer Footer */}
        <div className="figma-developer-footer">
          <div className="figma-developer-card">
            <h4 className="figma-developer-title">Developer</h4>
            <p className="figma-developer-email">darshan99806@gmail.com</p>
            <p className="figma-developer-phone">+91 7795129290</p>
            <p className="figma-developer-tagline">Made For Sullia citizens</p>
            <p className="figma-developer-copyright">© 2025 SulliaAuto. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;