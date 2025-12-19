import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/button';
import { useApp } from '../../contexts/AppContext';

export function VoiceButton() {
  const { isListening, setIsListening, voiceText, setVoiceText } = useApp();

  const handleClick = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate voice recognition
      setTimeout(() => {
        setVoiceText('');
      }, 2000);
    } else {
      setIsListening(true);
      // Simulate listening
      setTimeout(() => {
        setVoiceText('Pay my water bill');
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg z-50 ${
          isListening 
            ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </Button>

      {isListening && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-card p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Mic size={24} className="text-primary-foreground" />
              </div>
              <h3 className="text-xl mb-2">Listening...</h3>
              <p className="text-muted-foreground mb-4">I'm listening to your request</p>
              
              {voiceText && (
                <div className="bg-accent p-4 rounded-lg mb-4">
                  <p className="text-accent-foreground">"{voiceText}"</p>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                <p>Try saying:</p>
                <ul className="mt-2 space-y-1">
                  <li>"Pay my water bill"</li>
                  <li>"Book a cab to hospital"</li>
                  <li>"Call my doctor"</li>
                  <li>"Show my medicines"</li>
                </ul>
              </div>
              
              <Button 
                onClick={() => setIsListening(false)}
                variant="outline" 
                className="mt-4"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}