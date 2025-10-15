import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Stage } from '../context/DataContext';

interface StageListProps {
  stages?: Stage[];
}

const StageList: React.FC<StageListProps> = ({ stages: propStages }) => {
  const { t, language } = useLanguage();
  const { stages: contextStages, getDriversByStage } = useData();
  
  const stages = propStages || contextStages;

  return (
    <div className="stage-list">
      {stages.map((stage) => {
        const driverCount = getDriversByStage(stage.id).length;
        const stageName = language === 'kn' ? stage.nameKn : stage.name;
        
        return (
          <Link 
            key={stage.id} 
            to={`/stage/${stage.id}`} 
            className="stage-card"
            aria-label={`View drivers in ${stageName}`}
          >
            <div className="stage-icon">
              <MapPin size={24} />
            </div>
            
            <div className="stage-info">
              <h3 className="stage-name">{stageName}</h3>
              <div className="stage-stats">
                <Users size={16} />
                <span>{driverCount} {driverCount === 1 ? 'driver' : 'drivers'}</span>
              </div>
            </div>
            
            <div className="stage-arrow">
              →
            </div>
          </Link>
        );
      })}
      
      {stages.length === 0 && (
        <div className="no-stages">
          <p>{t('loading')}</p>
        </div>
      )}
    </div>
  );
};

export default StageList;