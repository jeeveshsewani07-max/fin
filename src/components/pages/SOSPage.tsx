import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Users, Shield, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { ManageEmergencyContactsDialog } from '../sos/ManageEmergencyContactsDialog';

export function SOSPage() {
  const [sosActivated, setSosActivated] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [showManageContacts, setShowManageContacts] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@email.com',
      relation: 'Son',
      priority: 'primary' as const,
      isVerified: true
    },
    {
      id: '2',
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      email: 'priya@email.com',
      relation: 'Daughter',
      priority: 'primary' as const,
      isVerified: false
    },
    {
      id: '3',
      name: 'Dr. Sharma',
      phone: '+91 98765 43212',
      email: 'dr.sharma@hospital.com',
      relation: 'Doctor',
      priority: 'secondary' as const,
      isVerified: true
    },
    {
      id: '4',
      name: 'Mrs. Gupta',
      phone: '+91 98765 43213',
      relation: 'Neighbor',
      priority: 'tertiary' as const,
      isVerified: true
    }
  ]);

  const serviceNumbers = [
    { name: 'Emergency Services', number: '112', type: 'emergency', online: true },
    { name: 'Police', number: '100', type: 'emergency', online: true },
    { name: 'Fire Department', number: '101', type: 'emergency', online: true },
    { name: 'Ambulance', number: '108', type: 'emergency', online: true }
  ];

  const handleSOSPress = () => {
    if (!sosActivated) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSosActivated(true);
            // Simulate SOS activation
            setTimeout(() => {
              setSosActivated(false);
            }, 10000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleEmergencyCall = (number: string) => {
    // Simulate emergency call
    console.log(`Calling ${number}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl mb-2">Emergency & Safety</h1>
        <p className="text-muted-foreground">Get help quickly when you need it most</p>
      </div>

      {/* SOS Button */}
      <Card className={`border-2 ${sosActivated ? 'border-destructive bg-destructive/10' : 'border-destructive/50'}`}>
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleSOSPress}
              className={`w-32 h-32 rounded-full text-white font-bold text-xl ${
                sosActivated 
                  ? 'bg-destructive/80 animate-pulse' 
                  : countdown > 0 
                    ? 'bg-destructive/60' 
                    : 'bg-destructive hover:bg-destructive/90'
              }`}
              disabled={sosActivated}
            >
              {countdown > 0 ? (
                <span className="text-3xl">{countdown}</span>
              ) : sosActivated ? (
                <div className="flex flex-col items-center">
                  <AlertTriangle size={32} className="mb-1" />
                  <span className="text-sm">ACTIVE</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <AlertTriangle size={32} className="mb-1" />
                  <span className="text-sm">SOS</span>
                </div>
              )}
            </Button>
            
            <div className="mt-4">
              {sosActivated ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-destructive">SOS Alert Sent!</p>
                  <p className="text-sm text-muted-foreground">
                    Emergency contacts have been notified and your location is being shared
                  </p>
                </div>
              ) : countdown > 0 ? (
                <p className="text-lg text-destructive">Hold for {countdown} more seconds...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Press and Hold for 3 seconds</p>
                  <p className="text-sm text-muted-foreground">
                    This will alert all your emergency contacts and share your location
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={24} />
            Location Sharing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="location-sharing" className="text-base">Share location with family</Label>
              <p className="text-sm text-muted-foreground">
                Allow your family to see your real-time location for safety
              </p>
            </div>
            <Switch
              id="location-sharing"
              checked={locationSharing}
              onCheckedChange={setLocationSharing}
            />
          </div>
          {locationSharing && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                📍 Your location is being shared with your family members
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone size={24} />
            Emergency Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceNumbers.map((contact, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-16 justify-between p-4"
                onClick={() => handleEmergencyCall(contact.number)}
              >
                <div className="text-left">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
                <Phone size={20} className="text-destructive" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Caregiver Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {contact.name.charAt(0)}
                    </div>
                    <Circle 
                      size={12} 
                      className={`absolute -bottom-1 -right-1 ${
                        contact.isVerified ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                      }`} 
                    />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relation} • {contact.phone}</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleEmergencyCall(contact.phone)}
                >
                  <Phone size={16} className="mr-2" />
                  Call
                </Button>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowManageContacts(true)}
          >
            <Users size={20} className="mr-2" />
            Manage Emergency Contacts
          </Button>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={24} />
            Safety Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <p>Keep your phone charged and within reach at all times</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <p>Update your emergency contacts regularly</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <p>Practice using the SOS button so you're familiar with it</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <p>Consider wearing a medical alert bracelet for additional safety</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manage Emergency Contacts Dialog */}
      <ManageEmergencyContactsDialog
        open={showManageContacts}
        onOpenChange={setShowManageContacts}
        contacts={emergencyContacts}
        onContactsUpdate={setEmergencyContacts}
      />
    </div>
  );
}