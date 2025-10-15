import React from 'react';
import { Phone, MessageCircle, Car } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Driver, Stage } from '../context/DataContext';

interface DriverCardProps {
  driver: Driver;
  stage?: Stage;
  showStage?: boolean;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, stage, showStage = false }) => {
  const { t } = useLanguage();

  const handleCall = () => {
    window.location.href = `tel:${driver.phoneNumber}`;
  };

  const handleWhatsApp = () => {
    if (driver.whatsappNumber) {
      const message = encodeURIComponent(`Hi ${driver.name}, I need an auto ride.`);
      window.open(`https://wa.me/${driver.whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
    }
  };

  return (
    <div className={`driver-card ${driver.isEmergency ? 'emergency' : ''}`}>
      <div className="driver-info">
        <div className="driver-header">
          <h3 className="driver-name">{driver.name}</h3>
          {driver.isEmergency && (
            <span className="emergency-badge">{t('emergency')}</span>
          )}
        </div>
        
        <div className="driver-details">
          <div className="detail-item">
            <Car size={16} />
            <span>{driver.vehicleNumber}</span>
          </div>
          
          {showStage && stage && (
            <div className="detail-item">
              <span className="stage-info">{stage.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="driver-actions">
        <button 
          className="btn btn-primary call-btn" 
          onClick={handleCall}
          aria-label={`Call ${driver.name}`}
        >
          <Phone size={18} />
          {t('callNow')}
        </button>
        
        {driver.whatsappNumber && (
          <button 
            className="btn btn-secondary whatsapp-btn" 
            onClick={handleWhatsApp}
            aria-label={`WhatsApp ${driver.name}`}
          >
            <MessageCircle size={18} />
            {t('whatsapp')}
          </button>
        )}
      </div>
    </div>
  );
};

export default DriverCard;