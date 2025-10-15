import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LanguageToggle from './components/LanguageToggle';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
          <Router>
            <div className="App">
              <LanguageToggle />
              <main className="app-main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/admin66" element={<AdminPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;