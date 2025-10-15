import React from 'react';
import { Phone, Mail, Code, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-title">{t('villageAutoConnect')}</h3>
            <p className="footer-description">
              Connecting villages with reliable auto transportation
            </p>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Developer</h4>
            <div className="contact-links">
              <a href="tel:+917795129290" className="contact-link">
                <Phone size={18} />
                <span>+91 7795129290</span>
              </a>
              <a href="mailto:darshan99806@gmail.com" className="contact-link">
                <Mail size={18} />
                <span>darshan99806@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-credits">
            <Code size={16} />
            <span>Built with</span>
            <Heart size={16} className="heart-icon" />
            <span>for rural communities</span>
          </div>
          <div className="footer-year">
            © 2024 Village Auto Connect
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;