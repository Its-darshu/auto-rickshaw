import React, { useState } from 'react';
import { MapPin, AlertCircle, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import SearchBar from '../components/SearchBar';
import DriverCard from '../components/DriverCard';
import SidebarMenu from '../components/SidebarMenu';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { stages, searchDrivers, getEmergencyDrivers, drivers } = useData();
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

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <div className="homepage">
      {/* Enhanced Header matching Figma design */}
      <header className="mobile-header">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="brand-title">Sullia Auto</h1>
          </div>
          <button 
            className="menu-button" 
            aria-label="Menu"
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

      {/* Sidebar Menu */}
      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="mobile-main-content">
        <div className="mobile-container">
          {/* Enhanced Search Section matching Figma */}
          <section className="mobile-search-section">
            <div className="search-container">
              <SearchBar onSearch={handleSearch} />
            </div>
          </section>

          {/* Places Section with enhanced cards */}
          <section className="places-section">
            <h2 className="section-title">Places</h2>

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

            {/* Enhanced Horizontal Cards matching Figma design */}
            {!isSearching && !selectedStage && (
              <div className="horizontal-cards-container">
                {stages.map((stage) => {
                  const stageDrivers = drivers.filter(d => d.stageId === stage.id);
                  const emergencyCount = stageDrivers.filter(d => d.isEmergency).length;
                  
                  return (
                    <div 
                      key={stage.id} 
                      className="horizontal-card"
                      onClick={() => handleStageSelect(stage.id)}
                    >
                      <div className="card-avatar">
                        <span className="avatar-initial">{stage.name.charAt(0)}</span>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="card-header">{stage.name}</h3>
                        <p className="card-subhead">{stage.nameKn}</p>
                        <div className="card-stats">
                          <span className="stat-item">{stageDrivers.length} drivers</span>
                          {emergencyCount > 0 && (
                            <span className="emergency-stat">{emergencyCount} 24/7</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="card-actions">
                        <div className="action-icon">
                          <Users size={20} />
                        </div>
                        <div className="action-icon">
                          <MapPin size={20} />
                        </div>
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