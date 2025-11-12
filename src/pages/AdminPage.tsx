import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Driver, Stage } from '../context/DataContext';

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    drivers, 
    stages, 
    addDriver, 
    updateDriver, 
    deleteDriver, 
    addStage
  } = useData();

  const { currentUser, isAdmin, signInWithEmail } = useAuth();
  
  // View states: 'dashboard' | 'drivers'
  const [currentView, setCurrentView] = useState<'dashboard' | 'drivers'>('dashboard');
  const [selectedPlace, setSelectedPlace] = useState<Stage | null>(null);
  
  // Modal states
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login state
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Stage form state
  const [stageForm, setStageForm] = useState({
    name: '',
    nameKn: ''
  });
  
  // Driver form state
  const [driverForm, setDriverForm] = useState({
    name: '',
    vehicleNumber: '',
    phoneNumber: ''
  });

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginError('');
      await signInWithEmail(email, password);
    } catch (error: any) {
      setLoginError(error.message || 'Failed to sign in');
    }
  };

  const resetStageForm = () => {
    setStageForm({ name: '', nameKn: '' });
  };

  const resetDriverForm = () => {
    setDriverForm({ name: '', vehicleNumber: '', phoneNumber: '' });
  };

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageForm.name.trim() || !stageForm.nameKn.trim()) {
      alert('Both place names are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addStage({
        name: stageForm.name.trim(),
        nameKn: stageForm.nameKn.trim()
      });
      resetStageForm();
      setShowAddPlaceModal(false);
    } catch (error: any) {
      console.error('Error adding place:', error);
      alert('Failed to add place. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace) return;
    
    if (!driverForm.name.trim() || !driverForm.vehicleNumber.trim() || !driverForm.phoneNumber.trim()) {
      alert('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const driverData = {
        name: driverForm.name.trim(),
        vehicleNumber: driverForm.vehicleNumber.trim(),
        phoneNumber: driverForm.phoneNumber.trim(),
        stageId: selectedPlace.id,
        isEmergency: false
      };
      
      if (editingDriver) {
        await updateDriver(editingDriver.id, driverData);
      } else {
        await addDriver(driverData);
      }
      
      resetDriverForm();
      setShowAddDriverModal(false);
      setEditingDriver(null);
    } catch (error: any) {
      console.error('Error saving driver:', error);
      alert('Failed to save driver. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setDriverForm({
      name: driver.name,
      vehicleNumber: driver.vehicleNumber,
      phoneNumber: driver.phoneNumber
    });
    setShowAddDriverModal(true);
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await deleteDriver(driverId);
      } catch (error) {
        console.error('Error deleting driver:', error);
        alert('Failed to delete driver. Please try again.');
      }
    }
  };

  const handlePlaceClick = (place: Stage) => {
    setSelectedPlace(place);
    setCurrentView('drivers');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedPlace(null);
  };

  // Filter drivers for selected place
  const placeDrivers = selectedPlace 
    ? drivers.filter(d => d.stageId === selectedPlace.id)
    : [];

  // Login screen
  if (!currentUser || !isAdmin) {
    return (
      <div className="figma-admin-login">
        <div className="figma-login-container">
          <form onSubmit={handleEmailSignIn} className="figma-login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="figma-email-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="figma-password-input"
              required
            />
            <button type="submit" className="figma-submit-btn">
              Submit
            </button>
          </form>
          
          {loginError && (
            <div className="figma-error-message">
              {loginError}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard view - showing all places
  if (currentView === 'dashboard') {
    return (
      <div className="figma-admin-dashboard">
        {/* Logo */}
        <div className="figma-admin-logo">
          <p>Sullia Auto</p>
        </div>

        {/* Places Grid */}
        <div className="figma-places-grid">
          {stages.map((stage) => (
            <div 
              key={stage.id}
              className="figma-place-card"
              onClick={() => handlePlaceClick(stage)}
            >
              <p>{stage.name}</p>
            </div>
          ))}
        </div>

        {/* Add Place Button */}
        <button 
          className="figma-add-place-btn"
          onClick={() => setShowAddPlaceModal(true)}
        >
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <rect width="50" height="50" rx="8" fill="black"/>
            <path d="M25 15V35M15 25H35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Add Place Modal */}
        {showAddPlaceModal && (
          <div className="figma-modal-overlay" onClick={() => setShowAddPlaceModal(false)}>
            <div className="figma-add-place-modal" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleAddPlace}>
                <input
                  type="text"
                  placeholder="place name"
                  value={stageForm.name}
                  onChange={(e) => setStageForm({...stageForm, name: e.target.value})}
                  className="figma-modal-input"
                  required
                />
                <input
                  type="text"
                  placeholder="place name in kannada"
                  value={stageForm.nameKn}
                  onChange={(e) => setStageForm({...stageForm, nameKn: e.target.value})}
                  className="figma-modal-input"
                  required
                />
                <button type="submit" className="figma-modal-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Drivers view - showing drivers for selected place
  return (
    <div className="figma-drivers-page">
      {/* Logo */}
      <div className="figma-admin-logo">
        <p>Sullia Auto</p>
      </div>

      {/* Place Name */}
      <div className="figma-place-name">
        <button onClick={handleBackToDashboard} className="figma-back-btn">←</button>
        <p>{selectedPlace?.name}</p>
      </div>

      {/* Drivers List */}
      <div className="figma-drivers-list">
        {placeDrivers.map((driver) => (
          <div key={driver.id} className="figma-driver-card">
            <div className="figma-driver-name">
              <p>{driver.name}</p>
            </div>
            <div className="figma-driver-actions">
              <button 
                className="figma-edit-btn"
                onClick={() => handleEditDriver(driver)}
              >
                <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
                  <path d="M3 21.5V26H7.5L21.31 12.19L16.81 7.69L3 21.5ZM24.71 9.79C25.1 9.4 25.1 8.77 24.71 8.38L21.62 5.29C21.23 4.9 20.6 4.9 20.21 5.29L17.79 7.71L22.29 12.21L24.71 9.79Z" fill="black"/>
                </svg>
              </button>
              <button 
                className="figma-delete-btn"
                onClick={() => handleDeleteDriver(driver.id)}
              >
                <svg width="26" height="27" viewBox="0 0 26 27" fill="none">
                  <path d="M6.5 21.5C6.5 22.6 7.4 23.5 8.5 23.5H17.5C18.6 23.5 19.5 22.6 19.5 21.5V7.5H6.5V21.5ZM20.5 4.5H16.5L15.5 3.5H10.5L9.5 4.5H5.5V6.5H20.5V4.5Z" fill="black"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Button */}
      <button 
        className="figma-add-driver-btn"
        onClick={() => {
          setEditingDriver(null);
          resetDriverForm();
          setShowAddDriverModal(true);
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <rect width="50" height="50" rx="8" fill="black"/>
          <path d="M25 15V35M15 25H35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Add/Edit Driver Modal */}
      {showAddDriverModal && (
        <div className="figma-modal-overlay" onClick={() => {
          setShowAddDriverModal(false);
          setEditingDriver(null);
        }}>
          <div className="figma-add-driver-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddDriver}>
              <input
                type="text"
                placeholder="Driver name"
                value={driverForm.name}
                onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                className="figma-modal-input"
                required
              />
              <input
                type="text"
                placeholder="Auto no"
                value={driverForm.vehicleNumber}
                onChange={(e) => setDriverForm({...driverForm, vehicleNumber: e.target.value})}
                className="figma-modal-input"
                required
              />
              <div className="figma-phone-input-container">
                <label className="figma-phone-label">phone</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={driverForm.phoneNumber}
                  onChange={(e) => setDriverForm({...driverForm, phoneNumber: e.target.value})}
                  className="figma-phone-input"
                  required
                  maxLength={10}
                />
              </div>
              <button type="submit" className="figma-modal-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
