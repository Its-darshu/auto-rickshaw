import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  vehicleNumber: string;
  stageId: string;
  isEmergency: boolean;
  whatsappNumber?: string;
}

export interface Stage {
  id: string;
  name: string;
  nameKn: string;
  latitude?: number;
  longitude?: number;
}

interface DataContextType {
  drivers: Driver[];
  stages: Stage[];
  loading: boolean;
  connectionError: boolean;
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<void>;
  updateDriver: (id: string, driver: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  addStage: (stage: Omit<Stage, 'id'>) => Promise<void>;
  updateStage: (id: string, stage: Partial<Stage>) => Promise<void>;
  deleteStage: (id: string) => Promise<void>;
  getDriversByStage: (stageId: string) => Driver[];
  getEmergencyDrivers: () => Driver[];
  searchDrivers: (query: string) => Driver[];
  initializeSampleData: () => Promise<void>;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

// Firestore collections
const DRIVERS_COLLECTION = 'drivers';
const STAGES_COLLECTION = 'stages';

// Input validation and sanitization functions
const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, ''); // Remove potential XSS characters
};

const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
};

const validateVehicleNumber = (vehicle: string): boolean => {
  const vehicleRegex = /^[A-Z]{2}[\-\s]?\d{2}[\-\s]?[A-Z]{1,2}[\-\s]?\d{1,4}$/i;
  return vehicleRegex.test(vehicle) || vehicle.length >= 4; // Allow flexible formats
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateLatLng = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value >= -180 && value <= 180;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  // Real-time listeners for Firestore data
  useEffect(() => {
    console.log('DataContext: Setting up Firestore listeners...');
    
    // Listen to stages changes
    const stagesQuery = query(collection(db, STAGES_COLLECTION), orderBy('name'));
    const unsubscribeStages = onSnapshot(
      stagesQuery, 
      (snapshot) => {
        console.log('DataContext: Stages snapshot received, docs:', snapshot.size);
        const stagesData: Stage[] = [];
        snapshot.forEach((doc) => {
          stagesData.push({ id: doc.id, ...doc.data() } as Stage);
        });
        console.log('DataContext: Stages loaded:', stagesData.length);
        setStages(stagesData);
        setLoading(false);
        setConnectionError(false);
      },
      (error) => {
        console.error('DataContext: Stages listener error:', error);
        console.error('DataContext: Error code:', error.code);
        console.error('DataContext: Error message:', error.message);
        setLoading(false);
        setConnectionError(true);
        
        // If permission denied, still try to continue
        if (error.code === 'permission-denied') {
          console.warn('DataContext: Permission denied for stages, using empty array');
          setStages([]);
        }
      }
    );

    // Listen to drivers changes
    const driversQuery = query(collection(db, DRIVERS_COLLECTION), orderBy('name'));
    const unsubscribeDrivers = onSnapshot(
      driversQuery, 
      (snapshot) => {
        console.log('DataContext: Drivers snapshot received, docs:', snapshot.size);
        const driversData: Driver[] = [];
        snapshot.forEach((doc) => {
          driversData.push({ id: doc.id, ...doc.data() } as Driver);
        });
        console.log('DataContext: Drivers loaded:', driversData.length);
        setDrivers(driversData);
        setConnectionError(false);
      },
      (error) => {
        console.error('DataContext: Drivers listener error:', error);
        console.error('DataContext: Error code:', error.code);
        console.error('DataContext: Error message:', error.message);
        setConnectionError(true);
        
        // If permission denied, still try to continue
        if (error.code === 'permission-denied') {
          console.warn('DataContext: Permission denied for drivers, using empty array');
          setDrivers([]);
        }
      }
    );

    // Cleanup listeners
    return () => {
      unsubscribeStages();
      unsubscribeDrivers();
    };
  }, []);

  const addDriver = async (newDriver: Omit<Driver, 'id'>) => {
    try {
      console.log('DataContext: Adding driver to Firestore:', newDriver);
      
      // Validate and sanitize required fields
      if (!newDriver.name?.trim()) {
        throw new Error('Driver name is required');
      }
      if (!newDriver.phoneNumber?.trim()) {
        throw new Error('Phone number is required');
      }
      if (!newDriver.vehicleNumber?.trim()) {
        throw new Error('Vehicle number is required');
      }
      if (!newDriver.stageId?.trim()) {
        throw new Error('Stage selection is required');
      }
      
      // Sanitize inputs
      const sanitizedName = sanitizeString(newDriver.name);
      const sanitizedPhone = sanitizeString(newDriver.phoneNumber);
      const sanitizedVehicle = sanitizeString(newDriver.vehicleNumber).toUpperCase();
      
      // Validate formats
      if (sanitizedName.length < 2 || sanitizedName.length > 50) {
        throw new Error('Driver name must be between 2 and 50 characters');
      }
      if (!validatePhoneNumber(sanitizedPhone)) {
        throw new Error('Invalid phone number format');
      }
      if (!validateVehicleNumber(sanitizedVehicle)) {
        throw new Error('Invalid vehicle number format');
      }
      
      // Create the document data, excluding undefined fields
      const driverData: any = {
        name: sanitizedName,
        phoneNumber: sanitizedPhone,
        vehicleNumber: sanitizedVehicle,
        stageId: newDriver.stageId,
        isEmergency: Boolean(newDriver.isEmergency),
        createdAt: new Date(),
      };
      
      // Validate and include WhatsApp number if provided
      if (newDriver.whatsappNumber?.trim()) {
        const sanitizedWhatsApp = sanitizeString(newDriver.whatsappNumber);
        if (!validatePhoneNumber(sanitizedWhatsApp)) {
          throw new Error('Invalid WhatsApp number format');
        }
        driverData.whatsappNumber = sanitizedWhatsApp;
      }
      
      const docRef = await addDoc(collection(db, DRIVERS_COLLECTION), driverData);
      
      console.log('DataContext: Driver added successfully with ID:', docRef.id);
    } catch (error: any) {
      console.error('DataContext: Error adding driver:', error);
      console.error('DataContext: Error code:', error.code);
      console.error('DataContext: Error message:', error.message);
      throw error;
    }
  };

  const updateDriver = async (id: string, updatedDriver: Partial<Driver>) => {
    try {
      if (!id?.trim()) {
        throw new Error('Driver ID is required for update');
      }
      
      const driverRef = doc(db, DRIVERS_COLLECTION, id);
      
      // Create update data, excluding undefined fields  
      const updateData: any = {
        updatedAt: new Date(),
      };
      
      // Validate and sanitize fields being updated
      if (updatedDriver.name !== undefined) {
        const sanitizedName = sanitizeString(updatedDriver.name);
        if (sanitizedName.length < 2 || sanitizedName.length > 50) {
          throw new Error('Driver name must be between 2 and 50 characters');
        }
        updateData.name = sanitizedName;
      }
      
      if (updatedDriver.phoneNumber !== undefined) {
        const sanitizedPhone = sanitizeString(updatedDriver.phoneNumber);
        if (!validatePhoneNumber(sanitizedPhone)) {
          throw new Error('Invalid phone number format');
        }
        updateData.phoneNumber = sanitizedPhone;
      }
      
      if (updatedDriver.vehicleNumber !== undefined) {
        const sanitizedVehicle = sanitizeString(updatedDriver.vehicleNumber).toUpperCase();
        if (!validateVehicleNumber(sanitizedVehicle)) {
          throw new Error('Invalid vehicle number format');
        }
        updateData.vehicleNumber = sanitizedVehicle;
      }
      
      if (updatedDriver.stageId !== undefined) {
        updateData.stageId = updatedDriver.stageId;
      }
      
      if (updatedDriver.isEmergency !== undefined) {
        updateData.isEmergency = Boolean(updatedDriver.isEmergency);
      }
      
      if (updatedDriver.whatsappNumber !== undefined) {
        if (updatedDriver.whatsappNumber.trim() !== '') {
          const sanitizedWhatsApp = sanitizeString(updatedDriver.whatsappNumber);
          if (!validatePhoneNumber(sanitizedWhatsApp)) {
            throw new Error('Invalid WhatsApp number format');
          }
          updateData.whatsappNumber = sanitizedWhatsApp;
        }
      }
      
      await updateDoc(driverRef, updateData);
    } catch (error) {
      console.error('Error updating driver:', error);
      throw error;
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      const driverRef = doc(db, DRIVERS_COLLECTION, id);
      await deleteDoc(driverRef);
    } catch (error) {
      console.error('Error deleting driver:', error);
      throw error;
    }
  };

  const addStage = async (newStage: Omit<Stage, 'id'>) => {
    try {
      console.log('DataContext: Adding stage to Firestore:', newStage);
      
      // Validate and sanitize required fields
      if (!newStage.name?.trim()) {
        throw new Error('Stage name (English) is required');
      }
      if (!newStage.nameKn?.trim()) {
        throw new Error('Stage name (Kannada) is required');
      }
      
      // Sanitize inputs
      const sanitizedName = sanitizeString(newStage.name);
      const sanitizedNameKn = sanitizeString(newStage.nameKn);
      
      // Validate lengths  
      if (sanitizedName.length < 2 || sanitizedName.length > 100) {
        throw new Error('Stage name must be between 2 and 100 characters');
      }
      if (sanitizedNameKn.length < 1 || sanitizedNameKn.length > 100) {
        throw new Error('Kannada name must be between 1 and 100 characters');
      }
      
      // Create the document data, excluding undefined fields
      const stageData: any = {
        name: sanitizedName,
        nameKn: sanitizedNameKn,
        createdAt: new Date(),
      };
      
      // Validate and include coordinates if provided
      if (newStage.latitude !== undefined) {
        if (!validateLatLng(newStage.latitude)) {
          throw new Error('Invalid latitude value (-90 to 90)');
        }
        stageData.latitude = newStage.latitude;
      }
      if (newStage.longitude !== undefined) {
        if (!validateLatLng(newStage.longitude)) {
          throw new Error('Invalid longitude value (-180 to 180)');
        }
        stageData.longitude = newStage.longitude;
      }
      
      const docRef = await addDoc(collection(db, STAGES_COLLECTION), stageData);
      
      console.log('DataContext: Stage added successfully with ID:', docRef.id);
    } catch (error: any) {
      console.error('DataContext: Error adding stage:', error);
      console.error('DataContext: Error code:', error.code);
      console.error('DataContext: Error message:', error.message);
      throw error;
    }
  };

  const updateStage = async (id: string, updatedStage: Partial<Stage>) => {
    try {
      const stageRef = doc(db, STAGES_COLLECTION, id);
      
      // Create update data, excluding undefined fields
      const updateData: any = {
        updatedAt: new Date(),
      };
      
      // Only include fields that are not undefined
      if (updatedStage.name !== undefined) {
        updateData.name = updatedStage.name;
      }
      if (updatedStage.nameKn !== undefined) {
        updateData.nameKn = updatedStage.nameKn;
      }
      if (updatedStage.latitude !== undefined && !isNaN(updatedStage.latitude)) {
        updateData.latitude = updatedStage.latitude;
      }
      if (updatedStage.longitude !== undefined && !isNaN(updatedStage.longitude)) {
        updateData.longitude = updatedStage.longitude;
      }
      
      await updateDoc(stageRef, updateData);
    } catch (error) {
      console.error('Error updating stage:', error);
      throw error;
    }
  };

  const deleteStage = async (id: string) => {
    try {
      const batch = writeBatch(db);
      
      // Delete the stage
      const stageRef = doc(db, STAGES_COLLECTION, id);
      batch.delete(stageRef);
      
      // Delete all drivers from this stage
      const driversToDelete = drivers.filter(driver => driver.stageId === id);
      driversToDelete.forEach(driver => {
        const driverRef = doc(db, DRIVERS_COLLECTION, driver.id);
        batch.delete(driverRef);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting stage:', error);
      throw error;
    }
  };

  const getDriversByStage = (stageId: string): Driver[] => {
    return drivers.filter(driver => driver.stageId === stageId);
  };

  const getEmergencyDrivers = (): Driver[] => {
    return drivers.filter(driver => driver.isEmergency);
  };

  const searchDrivers = (query: string): Driver[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(lowerQuery) ||
      driver.phoneNumber.includes(query) ||
      driver.vehicleNumber.toLowerCase().includes(lowerQuery)
    );
  };

  const refreshData = () => {
    console.log('DataContext: Manual data refresh requested');
    setLoading(true);
    setConnectionError(false);
    // The useEffect will automatically re-setup listeners
  };

  const initializeSampleData = async () => {
    try {
      // Check if data already exists
      const stagesSnapshot = await getDocs(collection(db, STAGES_COLLECTION));
      if (!stagesSnapshot.empty) {
        console.log('Sample data already exists, skipping initialization');
        return;
      }

      console.log('Initializing sample data...');
      const batch = writeBatch(db);

      // Sample stages
      const sampleStages = [
        { name: 'Bus Stand', nameKn: 'ಬಸ್ ಸ್ಟಾಂಡ್', latitude: 12.9716, longitude: 77.5946 },
        { name: 'Market', nameKn: 'ಮಾರುಕಟ್ಟೆ', latitude: 12.9726, longitude: 77.5956 },
        { name: 'Hospital', nameKn: 'ಆಸ್ಪತ್ರೆ', latitude: 12.9736, longitude: 77.5966 },
        { name: 'School', nameKn: 'ಶಾಲೆ', latitude: 12.9746, longitude: 77.5976 },
        { name: 'Temple', nameKn: 'ದೇವಸ್ಥಾನ', latitude: 12.9756, longitude: 77.5986 },
      ];

      // Add stages first
      const stageRefs: { [key: string]: string } = {};
      sampleStages.forEach((stage, index) => {
        const stageRef = doc(collection(db, STAGES_COLLECTION));
        stageRefs[`stage${index + 1}`] = stageRef.id;
        batch.set(stageRef, { ...stage, createdAt: new Date() });
      });

      await batch.commit();

      // Wait a moment for stages to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then add sample drivers
      const driversBatch = writeBatch(db);
      const sampleDrivers = [
        {
          name: 'Rajesh Kumar',
          phoneNumber: '+919876543210',
          vehicleNumber: 'KA-01-AB-1234',
          stageId: stageRefs.stage1,
          isEmergency: true,
          whatsappNumber: '+919876543210'
        },
        {
          name: 'Suresh Gowda',
          phoneNumber: '+919876543211',
          vehicleNumber: 'KA-01-AB-1235',
          stageId: stageRefs.stage1,
          isEmergency: false,
          whatsappNumber: '+919876543211'
        },
        {
          name: 'Manjunath',
          phoneNumber: '+919876543212',
          vehicleNumber: 'KA-01-AB-1236',
          stageId: stageRefs.stage2,
          isEmergency: true,
          whatsappNumber: '+919876543212'
        }
      ];

      sampleDrivers.forEach(driver => {
        const driverRef = doc(collection(db, DRIVERS_COLLECTION));
        driversBatch.set(driverRef, { ...driver, createdAt: new Date() });
      });

      await driversBatch.commit();
      console.log('Sample data initialized successfully');
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        drivers,
        stages,
        loading,
        connectionError,
        addDriver,
        updateDriver,
        deleteDriver,
        addStage,
        updateStage,
        deleteStage,
        getDriversByStage,
        getEmergencyDrivers,
        searchDrivers,
        initializeSampleData,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};