import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import SidebarMenu from '../components/SidebarMenu';

interface Driver {
  id: string;
  name: string;
  vehicleNumber: string;
  phoneNumber: string;
  whatsappNumber?: string;
  stageId: string;
  isEmergency: boolean;
}

interface Stage {
  id: string;
  name: string;
  nameKn: string;
}

const DriversPage: React.FC = () => {
  const { placeName } = useParams<{ placeName: string }>();
  const navigate = useNavigate();
  const { drivers, stages, loading } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Find the stage that matches the place name
  const currentStage = stages.find(stage => 
    stage.name === placeName || 
    decodeURIComponent(stage.name) === decodeURIComponent(placeName || '')
  );

  // Get drivers for this stage
  const stageDrivers = drivers.filter(driver => 
    driver.stageId === currentStage?.id
  );

  const filteredDrivers = stageDrivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWhatsApp = (driver: Driver) => {
    const phone = driver.whatsappNumber || driver.phoneNumber;
    const message = encodeURIComponent(`Hi ${driver.name}, I need an auto rickshaw ride from ${placeName}.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getDriverInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (!currentStage) {
    return (
      <div className="drivers-page-figma">
        <header className="figma-header">
          <button 
            className="figma-back-button"
            onClick={() => navigate('/')}
          >
            ←
          </button>
          <h1 className="figma-title">Sullia Auto</h1>
          <button 
            className="figma-menu-button"
            onClick={() => setIsSidebarOpen(true)}
          >
            <div className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </header>
        <div className="figma-empty-state">
          <p>Place not found: {placeName}</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
        <SidebarMenu 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="drivers-page-figma">
      {/* Header - Exact Figma Match */}
      <header className="figma-header">
        <div className="figma-header-content">
          <h1 className="figma-title">Sullia Auto</h1>
          <button 
            className="figma-menu-button"
            onClick={() => setIsSidebarOpen(true)}
          >
            <div className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </header>

      {/* Search Bar - Figma Style */}
      <div className="figma-search-container">
        <div className="figma-search-bar">
          <div className="search-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search Drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="figma-search-input"
          />
        </div>
      </div>

      {/* Place Title - Figma Style */}
      <div className="figma-place-title">
        <h2>{currentStage.name}</h2>
      </div>

      {/* Drivers Container - Exact Figma Layout */}
      <div className="figma-drivers-container">
        {loading ? (
          <div className="figma-loading-state">
            <div className="loading-spinner"></div>
            <p>Loading drivers...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="figma-empty-state">
            <p>No drivers found in {currentStage.name}</p>
            <button 
              className="figma-add-driver-btn"
              onClick={() => navigate('/admin66')}
            >
              Add Driver
            </button>
          </div>
        ) : (
          filteredDrivers.map((driver) => (
            <div key={driver.id} className="figma-driver-card">
              {/* Card Header with Avatar and Info */}
              <div className="figma-card-header">
                <div className="figma-avatar">
                  <span className="avatar-letter">{getDriverInitial(driver.name)}</span>
                </div>
                <div className="figma-driver-info">
                  <h3 className="figma-driver-name">{driver.name}</h3>
                  <p className="figma-place-name">{currentStage.name}</p>
                </div>
              </div>
              
              {/* Vehicle Number */}
              <div className="figma-vehicle-section">
                <p className="figma-vehicle-number">{driver.vehicleNumber}</p>
              </div>
              
              {/* Action Buttons - Exact Figma Style */}
              <div className="figma-actions">
                <button 
                  className="figma-whatsapp-btn"
                  onClick={() => handleWhatsApp(driver)}
                >
                  WhatsApp
                </button>
                <button 
                  className="figma-call-btn"
                  onClick={() => handleCall(driver.phoneNumber)}
                >
                  Call
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sidebar Menu */}
      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
};

export default DriversPage;