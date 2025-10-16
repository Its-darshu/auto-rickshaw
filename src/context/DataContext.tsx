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

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listeners for Firestore data
  useEffect(() => {
    // Listen to stages changes
    const stagesQuery = query(collection(db, STAGES_COLLECTION), orderBy('name'));
    const unsubscribeStages = onSnapshot(stagesQuery, (snapshot) => {
      const stagesData: Stage[] = [];
      snapshot.forEach((doc) => {
        stagesData.push({ id: doc.id, ...doc.data() } as Stage);
      });
      setStages(stagesData);
      setLoading(false);
    });

    // Listen to drivers changes
    const driversQuery = query(collection(db, DRIVERS_COLLECTION), orderBy('name'));
    const unsubscribeDrivers = onSnapshot(driversQuery, (snapshot) => {
      const driversData: Driver[] = [];
      snapshot.forEach((doc) => {
        driversData.push({ id: doc.id, ...doc.data() } as Driver);
      });
      setDrivers(driversData);
    });

    // Cleanup listeners
    return () => {
      unsubscribeStages();
      unsubscribeDrivers();
    };
  }, []);

  const addDriver = async (newDriver: Omit<Driver, 'id'>) => {
    try {
      console.log('DataContext: Adding driver to Firestore:', newDriver);
      
      // Validate required fields
      if (!newDriver.name || !newDriver.phoneNumber || !newDriver.vehicleNumber || !newDriver.stageId) {
        throw new Error('Name, phone number, vehicle number, and stage are required');
      }
      
      // Create the document data, excluding undefined fields
      const driverData: any = {
        name: newDriver.name,
        phoneNumber: newDriver.phoneNumber,
        vehicleNumber: newDriver.vehicleNumber,
        stageId: newDriver.stageId,
        isEmergency: newDriver.isEmergency || false,
        createdAt: new Date(),
      };
      
      // Only include whatsappNumber if it has a value
      if (newDriver.whatsappNumber && newDriver.whatsappNumber.trim() !== '') {
        driverData.whatsappNumber = newDriver.whatsappNumber.trim();
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
      const driverRef = doc(db, DRIVERS_COLLECTION, id);
      
      // Create update data, excluding undefined fields
      const updateData: any = {
        updatedAt: new Date(),
      };
      
      // Only include fields that are not undefined
      if (updatedDriver.name !== undefined) {
        updateData.name = updatedDriver.name;
      }
      if (updatedDriver.phoneNumber !== undefined) {
        updateData.phoneNumber = updatedDriver.phoneNumber;
      }
      if (updatedDriver.vehicleNumber !== undefined) {
        updateData.vehicleNumber = updatedDriver.vehicleNumber;
      }
      if (updatedDriver.stageId !== undefined) {
        updateData.stageId = updatedDriver.stageId;
      }
      if (updatedDriver.isEmergency !== undefined) {
        updateData.isEmergency = updatedDriver.isEmergency;
      }
      if (updatedDriver.whatsappNumber !== undefined && updatedDriver.whatsappNumber.trim() !== '') {
        updateData.whatsappNumber = updatedDriver.whatsappNumber.trim();
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
      
      // Validate required fields
      if (!newStage.name || !newStage.nameKn) {
        throw new Error('Name and Kannada name are required');
      }
      
      // Create the document data, excluding undefined fields
      const stageData: any = {
        name: newStage.name,
        nameKn: newStage.nameKn,
        createdAt: new Date(),
      };
      
      // Only include latitude/longitude if they have valid values
      if (newStage.latitude !== undefined && !isNaN(newStage.latitude)) {
        stageData.latitude = newStage.latitude;
      }
      if (newStage.longitude !== undefined && !isNaN(newStage.longitude)) {
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};