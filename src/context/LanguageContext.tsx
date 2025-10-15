import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    stages: 'Stages',
    emergency: 'Emergency',
    admin: 'Admin',
    
    // Homepage
    villageAutoConnect: 'Village Auto Connect',
    findAutoInstantly: 'Find Auto Drivers Instantly',
    selectStage: 'Select Your Stage',
    searchDrivers: 'Search Drivers...',
    emergencyAutos: 'Emergency Autos',
    availableNow: 'Available Now',
    
    // Driver Info
    callNow: 'Call Now',
    whatsapp: 'WhatsApp',
    vehicleNo: 'Vehicle No',
    stage: 'Stage',
    emergencyLabel: 'Emergency',
    
    // Admin
    adminLogin: 'Admin Login',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    dashboard: 'Dashboard',
    addStage: 'Add Stage',
    addDriver: 'Add Driver',
    manageStages: 'Manage Stages',
    manageDrivers: 'Manage Drivers',
    
    // Forms
    name: 'Name',
    phoneNumber: 'Phone Number',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    
    // Messages
    noDriversFound: 'No drivers found',
    searchResults: 'Search Results',
    loading: 'Loading...',
  },
  kn: {
    // Navigation
    home: 'ಮನೆ',
    stages: 'ಹಂತಗಳು',
    emergency: 'ತುರ್ತು',
    admin: 'ನಿರ್ವಾಹಕ',
    
    // Homepage
    villageAutoConnect: 'ಗ್ರಾಮ ಆಟೋ ಸಂಪರ್ಕ',
    findAutoInstantly: 'ತಕ್ಷಣವೇ ಆಟೋ ಚಾಲಕರನ್ನು ಹುಡುಕಿ',
    selectStage: 'ನಿಮ್ಮ ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    searchDrivers: 'ಚಾಲಕರನ್ನು ಹುಡುಕಿ...',
    emergencyAutos: 'ತುರ್ತು ಆಟೋಗಳು',
    availableNow: 'ಈಗ ಲಭ್ಯ',
    
    // Driver Info
    callNow: 'ಈಗ ಕರೆ ಮಾಡಿ',
    whatsapp: 'ವಾಟ್ಸ್ಆಪ್',
    vehicleNo: 'ವಾಹನ ಸಂಖ್ಯೆ',
    stage: 'ಹಂತ',
    emergencyLabel: 'ತುರ್ತು',
    
    // Admin
    adminLogin: 'ನಿರ್ವಾಹಕ ಲಾಗಿನ್',
    username: 'ಬಳಕೆದಾರಹೆಸರು',
    password: 'ಪಾಸ್ವರ್ಡ್',
    login: 'ಲಾಗಿನ್',
    dashboard: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್',
    addStage: 'ಹಂತ ಸೇರಿಸಿ',
    addDriver: 'ಚಾಲಕ ಸೇರಿಸಿ',
    manageStages: 'ಹಂತಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    manageDrivers: 'ಚಾಲಕರನ್ನು ನಿರ್ವಹಿಸಿ',
    
    // Forms
    name: 'ಹೆಸರು',
    phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    
    // Messages
    noDriversFound: 'ಚಾಲಕರು ಕಂಡುಬಂದಿಲ್ಲ',
    searchResults: 'ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು',
    loading: 'ಲೋಡಿಂಗ್...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translationKey = key as keyof typeof translations['en'];
    return translations[language]?.[translationKey] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};