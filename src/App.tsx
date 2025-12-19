import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { VoiceButton } from './components/Layout/VoiceButton';
import { Toaster } from './components/ui/sonner';
import { HomePage } from './components/pages/HomePage';
import { HealthPage } from './components/pages/HealthPage';
import { FindDoctorPage } from './components/pages/FindDoctorPage';
import { ChatBot } from './components/Layout/ChatBot';
import { RidesPage } from './components/pages/RidesPage';
import { BillsPage } from './components/pages/BillsPage';
import { SOSPage } from './components/pages/SOSPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { EventsPage } from './components/pages/EventsPage';
import { CommunityPage } from './components/pages/CommunityPage';
import { HealthcareHelpersPage } from './components/pages/HealthcareHelpersPage';
import { RemindersPage } from './components/pages/RemindersPage';

function AppContent() {
  const { currentPage, settings } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'health':
        return <HealthPage />;
      case 'findDoctor':
        return <FindDoctorPage />;
      case 'reminders':
        return <RemindersPage />;
      case 'events':
        return <EventsPage />;
      case 'community':
        return <CommunityPage />;
      case 'healthcareHelpers':
        return <HealthcareHelpersPage />;

      case 'rides':
        return <RidesPage />;
      case 'bills':
        return <BillsPage />;
      case 'sos':
        return <SOSPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  // Calculate dynamic font size and contrast values
  const dynamicFontSize = 14 + (settings.fontSize / 100) * 16; // 14px to 30px range (more accessible range)
  const dynamicContrast = 100 + (settings.contrast / 100) * 50; // 100% to 150% contrast range

  // Set CSS variables for dynamic scaling and apply theme
  useEffect(() => {
    document.documentElement.style.setProperty('--dynamic-font-size', `${dynamicFontSize}px`);
    document.documentElement.style.setProperty('--dynamic-contrast', `${dynamicContrast}%`);
    
    // Apply theme class to html element
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('dark', 'light');
    htmlElement.classList.add(settings.theme);
  }, [dynamicFontSize, dynamicContrast, settings.theme]);

  return (
    <div 
      className="min-h-screen bg-background text-foreground dynamic-scaling"
      style={{
        filter: `contrast(var(--dynamic-contrast))`,
        fontSize: 'var(--dynamic-font-size)'
      }}
    >
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          
          <main className="flex-1 overflow-auto p-4">
            <div className="max-w-7xl mx-auto">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
      
      <VoiceButton />
      <ChatBot />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}