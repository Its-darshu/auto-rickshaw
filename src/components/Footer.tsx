import React from 'react';
import { Phone, Mail, Code, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-brand">{t('villageAutoConnect')}</span>
            <span className="footer-year">© 2025</span>
          </div>
          
          <div className="footer-right">
            <a href="tel:+917795129290" className="contact-link" title="Call Developer">
              <Phone size={16} />
            </a>
            <a href="mailto:darshan99806@gmail.com" className="contact-link" title="Email Developer">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;