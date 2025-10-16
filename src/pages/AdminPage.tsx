import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, Trash2, Users, MapPin, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Driver, Stage } from '../context/DataContext';

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    drivers, 
    stages, 
    loading: dataLoading,
    addDriver, 
    updateDriver, 
    deleteDriver, 
    addStage, 
    updateStage, 
    deleteStage,
    initializeSampleData
  } = useData();

  const { currentUser, isAdmin, signInWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'drivers' | 'stages'>('drivers');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Driver | Stage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login state
  const [loginError, setLoginError] = useState('');
  
  // Driver form state
  const [driverForm, setDriverForm] = useState({
    name: '',
    phoneNumber: '',
    vehicleNumber: '',
    stageId: '',
    isEmergency: false,
    whatsappNumber: ''
  });
  
  // Stage form state
  const [stageForm, setStageForm] = useState({
    name: '',
    nameKn: '',
    latitude: '',
    longitude: ''
  });

  const handleGoogleSignIn = async () => {
    try {
      setLoginError('');
      await signInWithGoogle();
    } catch (error: any) {
      setLoginError(error.message || 'Failed to sign in with Google');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const resetDriverForm = () => {
    setDriverForm({
      name: '',
      phoneNumber: '',
      vehicleNumber: '',
      stageId: '',
      isEmergency: false,
      whatsappNumber: ''
    });
  };

  const resetStageForm = () => {
    setStageForm({
      name: '',
      nameKn: '',
      latitude: '',
      longitude: ''
    });
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (driverForm.name && driverForm.phoneNumber && driverForm.vehicleNumber && driverForm.stageId) {
      setIsSubmitting(true);
      try {
        await addDriver({
          ...driverForm,
          whatsappNumber: driverForm.whatsappNumber || undefined
        });
        resetDriverForm();
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding driver:', error);
        alert('Failed to add driver. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingItem(driver);
    setDriverForm({
      name: driver.name,
      phoneNumber: driver.phoneNumber,
      vehicleNumber: driver.vehicleNumber,
      stageId: driver.stageId,
      isEmergency: driver.isEmergency,
      whatsappNumber: driver.whatsappNumber || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && 'vehicleNumber' in editingItem) {
      setIsSubmitting(true);
      try {
        await updateDriver(editingItem.id, {
          ...driverForm,
          whatsappNumber: driverForm.whatsappNumber || undefined
        });
        resetDriverForm();
        setShowAddForm(false);
        setEditingItem(null);
      } catch (error) {
        console.error('Error updating driver:', error);
        alert('Failed to update driver. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!stageForm.name.trim()) {
      alert('Stage name (English) is required');
      return;
    }
    if (!stageForm.nameKn.trim()) {
      alert('Stage name (Kannada) is required');
      return;
    }
    
    console.log('Adding stage:', stageForm);
    console.log('Current user:', currentUser?.email);
    console.log('Is admin:', isAdmin);
    
    setIsSubmitting(true);
    try {
      const stageData = {
        name: stageForm.name.trim(),
        nameKn: stageForm.nameKn.trim(),
        latitude: stageForm.latitude ? parseFloat(stageForm.latitude) : undefined,
        longitude: stageForm.longitude ? parseFloat(stageForm.longitude) : undefined
      };
      
      console.log('Stage data to add:', stageData);
      await addStage(stageData);
      
      console.log('Stage added successfully');
      resetStageForm();
      setShowAddForm(false);
      alert('Stage added successfully!');
    } catch (error: any) {
      console.error('Error adding stage:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to add stage. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Make sure you are logged in as an admin.';
      } else if (error.code === 'network-request-failed') {
        errorMessage += 'Network error. Check your internet connection.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStage = (stage: Stage) => {
    setEditingItem(stage);
    setStageForm({
      name: stage.name,
      nameKn: stage.nameKn,
      latitude: stage.latitude?.toString() || '',
      longitude: stage.longitude?.toString() || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && 'nameKn' in editingItem) {
      setIsSubmitting(true);
      try {
        await updateStage(editingItem.id, {
          ...stageForm,
          latitude: stageForm.latitude ? parseFloat(stageForm.latitude) : undefined,
          longitude: stageForm.longitude ? parseFloat(stageForm.longitude) : undefined
        });
        resetStageForm();
        setShowAddForm(false);
        setEditingItem(null);
      } catch (error) {
        console.error('Error updating stage:', error);
        alert('Failed to update stage. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Debug information
  console.log('AdminPage - currentUser:', currentUser?.email);
  console.log('AdminPage - isAdmin:', isAdmin);
  console.log('AdminPage - drivers count:', drivers.length);
  console.log('AdminPage - stages count:', stages.length);

  if (!currentUser || !isAdmin) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="google-icon">
                <svg width="32" height="32" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </div>
              <h1>{t('adminLogin')}</h1>
              <p className="login-subtitle">Authorized administrators only</p>
            </div>
            
            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}
            
            <div className="login-form">
              <button 
                onClick={handleGoogleSignIn} 
                className="btn btn-google"
              >
                <svg width="20" height="20" viewBox="0 0 48 48" style={{marginRight: '12px'}}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Sign in with Google
              </button>
              
              <div className="login-info">
                <p>Only authorized Google accounts can access the admin panel.</p>
              </div>
            </div>
            
            <Link to="/" className="back-to-home">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} />
          </Link>
          
          <div className="admin-title">
            <h1>{t('dashboard')}</h1>
            <div className="admin-user-info">
              <img 
                src={currentUser?.photoURL || ''} 
                alt="Admin" 
                className="admin-avatar"
              />
              <span className="admin-email">{currentUser?.email}</span>
              <button 
                className="admin-logout-button"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="admin-content">
        <div className="container">
          {/* Admin Tabs */}
          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'drivers' ? 'active' : ''}`}
              onClick={() => setActiveTab('drivers')}
            >
              <Users size={20} />
              {t('manageDrivers')} ({drivers.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'stages' ? 'active' : ''}`}
              onClick={() => setActiveTab('stages')}
            >
              <MapPin size={20} />
              {t('manageStages')} ({stages.length})
            </button>
          </div>

          {/* Add Button */}
          <div className="admin-actions">
            <button 
              className="btn btn-primary add-btn"
              onClick={() => {
                setShowAddForm(true);
                setEditingItem(null);
                if (activeTab === 'drivers') resetDriverForm();
                else resetStageForm();
              }}
            >
              <Plus size={18} />
              {activeTab === 'drivers' ? t('addDriver') : t('addStage')}
            </button>
            
            {drivers.length === 0 && stages.length === 0 && (
              <button 
                className="btn btn-secondary"
                onClick={async () => {
                  if (window.confirm('Initialize with sample data? This will add demo drivers and stages.')) {
                    try {
                      await initializeSampleData();
                    } catch (error) {
                      console.error('Error initializing sample data:', error);
                      alert('Failed to initialize sample data. Please try again.');
                    }
                  }
                }}
              >
                Initialize Sample Data
              </button>
            )}
          </div>

          {/* Drivers Tab */}
          {activeTab === 'drivers' && (
            <div className="drivers-admin">
              {drivers.length === 0 ? (
                <div className="empty-state">
                  <Users size={48} />
                  <h3>No Drivers Yet</h3>
                  <p>Click "Add Driver" to start adding auto-rickshaw drivers to your system.</p>
                </div>
              ) : (
                <div className="admin-grid">
                  {drivers.map((driver) => {
                  const stage = stages.find(s => s.id === driver.stageId);
                  return (
                    <div key={driver.id} className="admin-card">
                      <div className="card-header">
                        <h3>{driver.name}</h3>
                        {driver.isEmergency && (
                          <span className="emergency-badge">Emergency</span>
                        )}
                      </div>
                      
                      <div className="card-details">
                        <p><strong>Phone:</strong> {driver.phoneNumber}</p>
                        <p><strong>Vehicle:</strong> {driver.vehicleNumber}</p>
                        <p><strong>Stage:</strong> {stage?.name || 'Unknown'}</p>
                        {driver.whatsappNumber && (
                          <p><strong>WhatsApp:</strong> {driver.whatsappNumber}</p>
                        )}
                      </div>
                      
                      <div className="card-actions">
                        <button 
                          className="btn-icon edit"
                          onClick={() => handleEditDriver(driver)}
                          title="Edit Driver"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="btn-icon delete"
                          onClick={async () => {
                            if (window.confirm('Delete this driver?')) {
                              try {
                                await deleteDriver(driver.id);
                              } catch (error) {
                                console.error('Error deleting driver:', error);
                                alert('Failed to delete driver. Please try again.');
                              }
                            }
                          }}
                          title="Delete Driver"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          )}

          {/* Stages Tab */}
          {activeTab === 'stages' && (
            <div className="stages-admin">
              {stages.length === 0 ? (
                <div className="empty-state">
                  <MapPin size={48} />
                  <h3>No Stages Yet</h3>
                  <p>Click "Add Stage" to start adding auto-rickshaw stages to your system.</p>
                </div>
              ) : (
                <div className="admin-grid">
                  {stages.map((stage) => {
                  const driverCount = drivers.filter(d => d.stageId === stage.id).length;
                  return (
                    <div key={stage.id} className="admin-card">
                      <div className="card-header">
                        <h3>{stage.name}</h3>
                        <span className="driver-count">{driverCount} drivers</span>
                      </div>
                      
                      <div className="card-details">
                        <p><strong>Kannada:</strong> {stage.nameKn}</p>
                        {stage.latitude && stage.longitude && (
                          <p><strong>Coordinates:</strong> {stage.latitude}, {stage.longitude}</p>
                        )}
                      </div>
                      
                      <div className="card-actions">
                        <button 
                          className="btn-icon edit"
                          onClick={() => handleEditStage(stage)}
                          title="Edit Stage"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="btn-icon delete"
                          onClick={async () => {
                            if (window.confirm('Delete this stage and all its drivers?')) {
                              try {
                                await deleteStage(stage.id);
                              } catch (error) {
                                console.error('Error deleting stage:', error);
                                alert('Failed to delete stage. Please try again.');
                              }
                            }
                          }}
                          title="Delete Stage"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>
                    {editingItem ? 'Edit' : 'Add'} {activeTab === 'drivers' ? 'Driver' : 'Stage'}
                  </h3>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                    }}
                  >
                    ×
                  </button>
                </div>
                
                {activeTab === 'drivers' ? (
                  <form onSubmit={editingItem ? handleUpdateDriver : handleAddDriver}>
                    <div className="form-group">
                      <label>Driver Name *</label>
                      <input
                        type="text"
                        value={driverForm.name}
                        onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        value={driverForm.phoneNumber}
                        onChange={(e) => setDriverForm({...driverForm, phoneNumber: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>WhatsApp Number</label>
                      <input
                        type="tel"
                        value={driverForm.whatsappNumber}
                        onChange={(e) => setDriverForm({...driverForm, whatsappNumber: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Vehicle Number *</label>
                      <input
                        type="text"
                        value={driverForm.vehicleNumber}
                        onChange={(e) => setDriverForm({...driverForm, vehicleNumber: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Stage *</label>
                      <select
                        value={driverForm.stageId}
                        onChange={(e) => setDriverForm({...driverForm, stageId: e.target.value})}
                        required
                      >
                        <option value="">Select Stage</option>
                        {stages.map((stage) => (
                          <option key={stage.id} value={stage.id}>
                            {stage.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={driverForm.isEmergency}
                          onChange={(e) => setDriverForm({...driverForm, isEmergency: e.target.checked})}
                        />
                        Emergency Driver (Available 24/7)
                      </label>
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : `${editingItem ? 'Update' : 'Add'} Driver`}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingItem(null);
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={editingItem ? handleUpdateStage : handleAddStage}>
                    <div className="form-group">
                      <label>Stage Name (English) *</label>
                      <input
                        type="text"
                        value={stageForm.name}
                        onChange={(e) => setStageForm({...stageForm, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Stage Name (Kannada) *</label>
                      <input
                        type="text"
                        value={stageForm.nameKn}
                        onChange={(e) => setStageForm({...stageForm, nameKn: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Latitude (Optional)</label>
                      <input
                        type="number"
                        step="any"
                        value={stageForm.latitude}
                        onChange={(e) => setStageForm({...stageForm, latitude: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Longitude (Optional)</label>
                      <input
                        type="number"
                        step="any"
                        value={stageForm.longitude}
                        onChange={(e) => setStageForm({...stageForm, longitude: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : `${editingItem ? 'Update' : 'Add'} Stage`}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingItem(null);
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;