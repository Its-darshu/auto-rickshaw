import React from 'react';
import { MapPin } from 'lucide-react';
import { Stage } from '../context/DataContext';

interface MapViewProps {
  stages: Stage[];
  selectedStageId?: string;
  onStageSelect?: (stageId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ stages, selectedStageId, onStageSelect }) => {
  const handleStageClick = (stageId: string) => {
    if (onStageSelect) {
      onStageSelect(stageId);
    }
  };

  return (
    <div className="map-container">
      <div className="map-placeholder">
        <div className="map-grid">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={`map-marker ${selectedStageId === stage.id ? 'selected' : ''}`}
              style={{
                gridColumn: (index % 3) + 1,
                gridRow: Math.floor(index / 3) + 1,
              }}
              onClick={() => handleStageClick(stage.id)}
            >
              <MapPin size={20} />
              <span className="marker-label">{stage.name}</span>
            </div>
          ))}
        </div>
        
        <div className="map-legend">
          <p>🗺️ Village Map - Click on markers to view drivers</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;