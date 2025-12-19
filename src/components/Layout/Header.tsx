import React from 'react';
import { Search, Mic, AlertTriangle, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useApp } from '../../contexts/AppContext';

export function Header() {
  const { userName, setCurrentPage, setIsListening, t, settings, updateSettings } = useApp();

  const handleSOSClick = () => {
    setCurrentPage('sos');
  };

  const handleVoiceClick = () => {
    setIsListening(true);
  };

  const handleThemeToggle = () => {
    updateSettings({
      theme: settings.theme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <header className="bg-card border-b border-border p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              placeholder={t.settings.language === 'hindi' ? "खोजें या मदद मांगें..." : "Search or ask for help..."}
              className="pl-12 pr-12 h-12 text-lg bg-input-background border-border"
            />
            <Button
              onClick={handleVoiceClick}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-accent"
            >
              <Mic size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 ml-6">
          <div className="hidden lg:block text-right">
            <p className="text-foreground">{t.goodEvening}, {userName} 👋</p>
            <p className="text-sm text-muted-foreground">{t.howCanIHelp}</p>
          </div>
          
          <Button
            onClick={handleThemeToggle}
            variant="outline"
            size="sm"
            className="h-12 px-4"
            title={settings.theme === 'dark' ? t.switchToLightMode : t.switchToDarkMode}
          >
            {settings.theme === 'dark' ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </Button>
          
          <Button 
            onClick={handleSOSClick}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-12 px-6 font-semibold"
          >
            <AlertTriangle size={20} className="mr-2" />
            SOS
          </Button>
        </div>
      </div>
    </header>
  );
}