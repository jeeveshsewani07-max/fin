import React from 'react';
import { Home, Heart, Car, Receipt, Settings, Shield, Stethoscope, Calendar, Users, UserCheck, Bell } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  className?: string;
}

// Moved inside component to access translations

export function Sidebar({ className = '' }: SidebarProps) {
  const { currentPage, setCurrentPage, t } = useApp();

  const menuItems = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'health', icon: Heart, label: t.health },
    { id: 'findDoctor', icon: Stethoscope, label: t.findDoctor },
    { id: 'reminders', icon: Bell, label: t.reminders },
    { id: 'events', icon: Calendar, label: t.events },
    { id: 'community', icon: Users, label: t.community },
    { id: 'healthcareHelpers', icon: UserCheck, label: t.healthcareHelpers },
    { id: 'rides', icon: Car, label: t.rides },
    { id: 'bills', icon: Receipt, label: t.bills },
    { id: 'sos', icon: Shield, label: t.sos },
    { id: 'settings', icon: Settings, label: t.settings }
  ];

  return (
    <div className={`bg-sidebar border-r border-sidebar-border w-20 lg:w-64 flex flex-col ${className}`}>
      <div className="p-3 lg:p-4">
        <div className="hidden lg:block">
          <h1 className="text-xl text-sidebar-foreground">Senior Assist</h1>
          <p className="text-sm text-sidebar-foreground/70 mt-1">Stay connected & safe</p>
        </div>
        <div className="lg:hidden text-center">
          <span className="text-lg text-sidebar-foreground">SA</span>
        </div>
      </div>
      
      <nav className="flex-1 px-2 lg:px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 p-2 lg:p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon size={24} />
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-2 border-t border-sidebar-border">
        <div className="hidden lg:block text-xs text-sidebar-foreground/50 text-center">
          <p>© 2025 Senior Assist</p>
        </div>
      </div>
    </div>
  );
}