import React, { useState } from 'react';
import { MapPin, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import SearchBar from '../components/SearchBar';
import DriverCard from '../components/DriverCard';
import SidebarMenu from '../components/SidebarMenu';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { stages, searchDrivers, getEmergencyDrivers, drivers } = useData();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const emergencyDrivers = getEmergencyDrivers();
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      setIsSearching(true);
      setSelectedStage(null);
      const results = searchDrivers(query);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSelectedStage(null);
      setSearchResults([]);
    }
  };

  const handleStageSelect = (stageName: string) => {
    // Navigate to drivers page with the place name
    navigate(`/drivers/${encodeURIComponent(stageName)}`);
  };

  return (
    <div className="homepage">
      {/* Figma Header Design */}
      <header className="figma-header">
        <div className="figma-header-content">
          <h1 className="figma-brand-title">Sullia Auto</h1>
          <button 
            className="figma-menu-btn" 
            aria-label="Menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg width="50" height="51" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="50" height="51" fill="white"/>
              <path d="M7.8125 12.75H42.1875M7.8125 25.5H42.1875M7.8125 38.25H42.1875" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Sidebar Menu */}
      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="figma-main-content">
        <div className="figma-container">
          {/* Figma Search Section */}
          <section className="figma-search-section">
            <SearchBar onSearch={handleSearch} />
          </section>

          {/* Figma Places Section */}
          <section className="figma-places-section">
            <h2 className="figma-places-title">Places</h2>

          {/* Search Results */}
          {isSearching && (
            <section className="search-results">
              <h2>{t('searchResults')}</h2>
              {searchResults.length > 0 ? (
                <div className="drivers-grid">
                  {searchResults.map((driver) => {
                    const stage = stages.find(s => s.id === driver.stageId);
                    return (
                      <DriverCard 
                        key={driver.id} 
                        driver={driver} 
                        stage={stage}
                        showStage={true}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="no-results">{t('noDriversFound')}</p>
              )}
            </section>
          )}

          {/* Emergency Drivers Section - Always Visible */}
          {!isSearching && !selectedStage && emergencyDrivers.length > 0 && (
            <section className="emergency-section">
              <div className="section-header">
                <AlertCircle className="emergency-icon" size={24} />
                <h2>Emergency Autos (24/7 Available)</h2>
              </div>
              <div className="drivers-grid">
                {emergencyDrivers.slice(0, 3).map((driver) => {
                  const stage = stages.find(s => s.id === driver.stageId);
                  return (
                    <DriverCard 
                      key={driver.id} 
                      driver={driver} 
                      stage={stage}
                      showStage={true}
                    />
                  );
                })}
              </div>
              {emergencyDrivers.length > 3 && (
                <p className="view-all-text">
                  Showing 3 of {emergencyDrivers.length} emergency drivers
                </p>
              )}
            </section>
          )}

            {/* Figma Place Cards */}
            {!isSearching && !selectedStage && (
              <div className="figma-places-grid">
                {stages.map((stage) => {
                  const stageDrivers = drivers.filter(d => d.stageId === stage.id);
                  
                  return (
                    <div 
                      key={stage.id} 
                      className="figma-place-card"
                      onClick={() => handleStageSelect(stage.name)}
                    >
                      <div className="figma-place-name">
                        {stage.name}
                      </div>
                      <div className="figma-place-image">
                        {/* Image placeholder - matching Figma design */}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Selected Stage Drivers */}
          {selectedStage && (
            <section className="stage-drivers-section">
              {(() => {
                const stage = stages.find(s => s.id === selectedStage);
                const stageDrivers = drivers.filter(d => d.stageId === selectedStage);
                const emergencyDriversInStage = stageDrivers.filter(d => d.isEmergency);
                const regularDriversInStage = stageDrivers.filter(d => !d.isEmergency);

                return (
                  <>
                    <div className="section-header">
                      <button 
                        className="back-btn"
                        onClick={() => setSelectedStage(null)}
                        style={{ 
                          background: 'var(--primary-green)', 
                          color: 'white', 
                          border: 'none', 
                          padding: '8px 16px', 
                          borderRadius: '6px',
                          cursor: 'pointer',
                          marginRight: '16px'
                        }}
                      >
                        ← Back
                      </button>
                      <div>
                        <h2>{stage?.name} ({stage?.nameKn})</h2>
                        <p>{stageDrivers.length} drivers available</p>
                      </div>
                    </div>

                    {/* Emergency drivers first */}
                    {emergencyDriversInStage.length > 0 && (
                      <div className="drivers-section">
                        <h3 className="section-title emergency">
                          <AlertCircle size={20} />
                          Emergency Drivers (24/7)
                        </h3>
                        <div className="drivers-grid">
                          {emergencyDriversInStage.map((driver) => (
                            <DriverCard 
                              key={driver.id} 
                              driver={driver} 
                              stage={stage}
                              showStage={false}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular drivers */}
                    {regularDriversInStage.length > 0 && (
                      <div className="drivers-section">
                        <h3 className="section-title">
                          <Users size={20} />
                          Regular Drivers
                        </h3>
                        <div className="drivers-grid">
                          {regularDriversInStage.map((driver) => (
                            <DriverCard 
                              key={driver.id} 
                              driver={driver} 
                              stage={stage}
                              showStage={false}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {stageDrivers.length === 0 && (
                      <div className="empty-state">
                        <Users size={48} />
                        <h3>No drivers available in {stage?.name}</h3>
                        <p>Please try another stage or check back later.</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </section>
          )}
        </div>
      </main>


    </div>
  );
};

export default HomePage;