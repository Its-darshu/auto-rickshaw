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
      <div className="figma-drivers-page">
        <header className="figma-header">
          <div className="figma-header-content">
            <h1 className="figma-brand-title">Sullia Auto</h1>
            <button 
              className="figma-menu-btn"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg width="50" height="51" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="51" fill="white"/>
                <path d="M7.8125 12.75H42.1875M7.8125 25.5H42.1875M7.8125 38.25H42.1875" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </header>
        <div className="figma-empty-state">
          <p>Place not found: {placeName}</p>
          <button className="figma-add-driver-btn" onClick={() => navigate('/')}>Go Back</button>
        </div>
        <SidebarMenu 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="figma-drivers-page">
      {/* Header - Exact Figma Match */}
      <header className="figma-header">
        <div className="figma-header-content">
          <h1 className="figma-brand-title">Sullia Auto</h1>
          <button 
            className="figma-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg width="50" height="51" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="50" height="51" fill="white"/>
              <path d="M7.8125 12.75H42.1875M7.8125 25.5H42.1875M7.8125 38.25H42.1875" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Search Bar - Figma Style matching HomePage */}
      <div className="figma-search-section">
        <div className="figma-search-wrapper">
          <div className="figma-search-box">
            <div className="figma-search-icon">
              <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.375 23.375L29.5625 29.5625M14.4375 26.125C7.70638 26.125 2.25 20.6686 2.25 13.9375C2.25 7.20638 7.70638 1.75 14.4375 1.75C21.1686 1.75 26.625 7.20638 26.625 13.9375C26.625 20.6686 21.1686 26.125 14.4375 26.125Z" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search Drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="figma-search-input"
            />
            {searchTerm && (
              <button 
                className="figma-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Place Title - Figma Style */}
      <div className="figma-drivers-heading">
        <h2>{currentStage.name}</h2>
      </div>

      {/* Drivers Container - Exact Figma Layout */}
      <div className="figma-drivers-list">
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
            <div key={driver.id} className="figma-driver-item">
              {/* Driver Info Box */}
              <div className="figma-driver-info-box">
                <div className="figma-driver-name-text">{driver.name}</div>
                <div className="figma-auto-number-text">{driver.vehicleNumber}</div>
                <div className="figma-phone-label">Phone no</div>
              </div>
              
              {/* WhatsApp Button */}
              <button 
                className="figma-whatsapp-button"
                onClick={() => handleWhatsApp(driver)}
              >
                WhatsApp
              </button>
              
              {/* Call Button */}
              <button 
                className="figma-call-button"
                onClick={() => handleCall(driver.phoneNumber)}
              >
                Call
              </button>
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