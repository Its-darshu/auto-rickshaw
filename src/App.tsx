import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import DriversPage from './pages/DriversPage';
import LanguageToggle from './components/LanguageToggle';
import './App.css';

function App() {
  // Check if this is an admin build
  const isAdminBuild = process.env.REACT_APP_BUILD_TYPE === 'admin';
  
  return (
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
          <Router>
            <div className="App">
              <main className="app-main">
                <Routes>
                  {isAdminBuild ? (
                    // Admin-only routes - redirect everything to admin
                    <>
                      <Route path="/admin66" element={<AdminPage />} />
                      <Route path="/*" element={<Navigate to="/admin66" replace />} />
                    </>
                  ) : (
                    // Regular user routes
                    <>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/drivers/:placeName" element={<DriversPage />} />
                      <Route path="/admin66" element={<AdminPage />} />
                    </>
                  )}
                </Routes>
              </main>
            </div>
          </Router>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;