import React from 'react';
import { X, Phone, Mail, Globe } from 'lucide-react';
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
      
      {/* Sidebar */}
      <div className={`sidebar-menu ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Menu</h2>
          <button 
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Language Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              <Globe size={18} />
              Language
            </h3>
            <button 
              className="language-toggle-sidebar"
              onClick={toggleLanguage}
            >
              {language === 'en' ? 'Switch to ಕನ್ನಡ' : 'Switch to English'}
            </button>
          </div>

          {/* App Info */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">About</h3>
            <p className="app-description">
              {t('villageAutoConnect')} - Connecting villages with reliable auto transportation
            </p>
          </div>
        </div>

        {/* Developer Details Footer */}
        <div className="sidebar-footer">
          <div className="developer-section">
            <h4 className="developer-title">Developer</h4>
            <div className="developer-contacts">
              <a 
                href="tel:+917795129290" 
                className="developer-contact"
                title="Call Developer"
              >
                <Phone size={16} />
                <span>+91 7795129290</span>
              </a>
              <a 
                href="mailto:darshan99806@gmail.com" 
                className="developer-contact"
                title="Email Developer"
              >
                <Mail size={16} />
                <span>darshan99806@gmail.com</span>
              </a>
            </div>
            <div className="copyright">
              © 2025 Sullia Auto Connect
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;