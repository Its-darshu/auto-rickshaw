import React, { useState } from 'react';
import { MapPin, AlertCircle, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import SearchBar from '../components/SearchBar';
import DriverCard from '../components/DriverCard';
import LanguageToggle from '../components/LanguageToggle';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { stages, searchDrivers, getEmergencyDrivers, drivers } = useData();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

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
      <header className="App-header">
        <LanguageToggle />
        <h1 className="App-title">{t('villageAutoConnect')}</h1>
        <p className="App-subtitle">{t('findAutoInstantly')}</p>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Search Section */}
          <section className="search-section">
            <SearchBar onSearch={handleSearch} />
          </section>

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

          {/* Stage Selection */}
          {!isSearching && !selectedStage && (
            <>
              {/* Stages Section */}
              <section className="stages-section">
                <h2>
                  <MapPin size={20} />
                  {t('selectStage')}
                </h2>
                <div className="stages-grid">
                  {stages.map((stage) => {
                    const stageDrivers = drivers.filter(d => d.stageId === stage.id);
                    return (
                      <div 
                        key={stage.id} 
                        className="stage-card"
                        onClick={() => handleStageSelect(stage.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="stage-icon">
                          <MapPin size={24} />
                        </div>
                        <div className="stage-info">
                          <h3 className="stage-name">{stage.name}</h3>
                          <p className="stage-name-kn">{stage.nameKn}</p>
                          <div className="stage-stats">
                            <Users size={16} />
                            <span>{stageDrivers.length} drivers available</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

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