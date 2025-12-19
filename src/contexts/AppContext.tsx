import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTranslation, type Translations } from '../utils/translations';

interface AppSettings {
  fontSize: number; // 0-100 scale (0 = smallest, 100 = largest)
  contrast: number; // 0-100 scale (0 = normal contrast, 100 = highest contrast)
  voiceEnabled: boolean;
  language: 'english' | 'hindi';
  theme: 'dark' | 'light';
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  permissions: {
    healthData: 'full' | 'view' | 'none';
    medicationReminders: 'full' | 'view' | 'none';
    emergencyAlerts: 'full' | 'view' | 'none';
    locationTracking: 'full' | 'view' | 'none';
    callHistory: 'full' | 'view' | 'none';
    appointmentScheduling: 'full' | 'view' | 'none';
  };
}

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  userName: string;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  voiceText: string;
  setVoiceText: (text: string) => void;
  t: Translations;
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMemberPermissions: (id: string, permissions: FamilyMember['permissions']) => void;
  removeFamilyMember: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 30, // Default to 30% on the scale (normal size)
    contrast: 0,  // Default to 0% (normal contrast)
    voiceEnabled: true,
    language: 'english',
    theme: 'light'
  });
  const [userName] = useState('Meera');
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Rajesh',
      relationship: 'Son',
      phone: '+91 98765 43210',
      email: 'rajesh@email.com',
      permissions: {
        healthData: 'full',
        medicationReminders: 'full',
        emergencyAlerts: 'full',
        locationTracking: 'full',
        callHistory: 'full',
        appointmentScheduling: 'full'
      }
    },
    {
      id: '2',
      name: 'Priya',
      relationship: 'Daughter',
      phone: '+91 98765 43211',
      email: 'priya@email.com',
      permissions: {
        healthData: 'full',
        medicationReminders: 'full',
        emergencyAlerts: 'full',
        locationTracking: 'full',
        callHistory: 'view',
        appointmentScheduling: 'full'
      }
    },
    {
      id: '3',
      name: 'Dr. Sharma',
      relationship: 'Doctor',
      phone: '+91 98765 43212',
      email: 'dr.sharma@clinic.com',
      permissions: {
        healthData: 'full',
        medicationReminders: 'view',
        emergencyAlerts: 'view',
        locationTracking: 'none',
        callHistory: 'none',
        appointmentScheduling: 'full'
      }
    }
  ]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString()
    };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  const updateFamilyMemberPermissions = (id: string, permissions: FamilyMember['permissions']) => {
    setFamilyMembers(prev => 
      prev.map(member => 
        member.id === id 
          ? { ...member, permissions }
          : member
      )
    );
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  const t = useTranslation(settings.language);

  return (
    <AppContext.Provider value={{
      currentPage,
      setCurrentPage,
      settings,
      updateSettings,
      userName,
      isListening,
      setIsListening,
      voiceText,
      setVoiceText,
      t,
      familyMembers,
      addFamilyMember,
      updateFamilyMemberPermissions,
      removeFamilyMember
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}