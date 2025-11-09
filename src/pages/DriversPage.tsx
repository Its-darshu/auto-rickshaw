import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import SidebarMenu from '../components/SidebarMenu';
import SearchBar from '../components/SearchBar';

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

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

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

      {/* Main Content Container */}
      <main className="figma-main-content">
        <div className="figma-container">
          {/* Search Bar - Same as HomePage */}
          <section className="figma-search-section">
            <SearchBar onSearch={handleSearch} placeholder="Search Drivers..." />
          </section>
        </div>
      </main>

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