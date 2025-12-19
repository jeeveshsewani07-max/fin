import React, { useState } from 'react';
import { Heart, Phone, Calendar, Star, MapPin, Clock, Filter, User, Stethoscope, Activity, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface HealthcareHelper {
  id: string;
  name: string;
  specialization: string;
  serviceType: 'nurse' | 'physiotherapist' | 'caregiver' | 'homeAssistant';
  yearsExperience: number;
  rating: number;
  totalReviews: number;
  availability: string[];
  location: string;
  hourlyRate: number;
  languages: string[];
  certifications: string[];
  description: string;
  isAvailable: boolean;
}

export function HealthcareHelpersPage() {
  const { t } = useApp();
  
  const [helpers, setHelpers] = useState<HealthcareHelper[]>([
    {
      id: '1',
      name: 'Nurse Priya Sharma',
      specialization: 'Geriatric Care',
      serviceType: 'nurse',
      yearsExperience: 8,
      rating: 4.9,
      totalReviews: 156,
      availability: ['Morning', 'Evening'],
      location: 'South Delhi',
      hourlyRate: 500,
      languages: ['Hindi', 'English'],
      certifications: ['RN License', 'Geriatric Specialist'],
      description: 'Experienced in elderly care with expertise in medication management and health monitoring.',
      isAvailable: true
    },
    {
      id: '2',
      name: 'Dr. Rajesh Physiotherapist',
      specialization: 'Mobility & Pain Management',
      serviceType: 'physiotherapist',
      yearsExperience: 12,
      rating: 4.8,
      totalReviews: 203,
      availability: ['Morning', 'Afternoon'],
      location: 'East Mumbai',
      hourlyRate: 800,
      languages: ['Hindi', 'English', 'Marathi'],
      certifications: ['BPT', 'Pain Management Specialist'],
      description: 'Specializes in senior mobility improvement and chronic pain management therapies.',
      isAvailable: true
    },
    {
      id: '3',
      name: 'Sunita Caregiver',
      specialization: 'Daily Living Assistance',
      serviceType: 'caregiver',
      yearsExperience: 6,
      rating: 4.7,
      totalReviews: 89,
      availability: ['Full Day', 'Night'],
      location: 'North Bangalore',
      hourlyRate: 300,
      languages: ['Hindi', 'Kannada', 'English'],
      certifications: ['Certified Caregiver', 'First Aid'],
      description: 'Compassionate caregiver helping with daily activities, meal preparation, and companionship.',
      isAvailable: false
    },
    {
      id: '4',
      name: 'Meera Home Assistant',
      specialization: 'Household Support',
      serviceType: 'homeAssistant',
      yearsExperience: 4,
      rating: 4.6,
      totalReviews: 124,
      availability: ['Morning', 'Afternoon'],
      location: 'West Chennai',
      hourlyRate: 250,
      languages: ['Tamil', 'Hindi', 'English'],
      certifications: ['Home Care Specialist'],
      description: 'Reliable home assistant for cleaning, cooking, and household management for seniors.',
      isAvailable: true
    },
    {
      id: '5',
      name: 'Nurse Kavita Patel',
      specialization: 'Chronic Disease Management',
      serviceType: 'nurse',
      yearsExperience: 10,
      rating: 4.9,
      totalReviews: 178,
      availability: ['Evening', 'Night'],
      location: 'Central Pune',
      hourlyRate: 600,
      languages: ['Hindi', 'English', 'Gujarati'],
      certifications: ['RN License', 'Diabetes Care Specialist'],
      description: 'Expert in managing diabetes, hypertension, and other chronic conditions in elderly patients.',
      isAvailable: true
    }
  ]);

  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  const filteredHelpers = helpers.filter(helper => {
    const serviceMatch = serviceFilter === 'all' || helper.serviceType === serviceFilter;
    const locationMatch = locationFilter === 'all' || helper.location.toLowerCase().includes(locationFilter.toLowerCase());
    const availabilityMatch = availabilityFilter === 'all' || helper.availability.some(slot => 
      slot.toLowerCase().includes(availabilityFilter.toLowerCase())
    );
    
    return serviceMatch && locationMatch && availabilityMatch;
  });

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'nurse':
        return <Stethoscope size={20} className="text-blue-500" />;
      case 'physiotherapist':
        return <Activity size={20} className="text-green-500" />;
      case 'caregiver':
        return <Heart size={20} className="text-red-500" />;
      case 'homeAssistant':
        return <Home size={20} className="text-purple-500" />;
      default:
        return <User size={20} className="text-gray-500" />;
    }
  };

  const getServiceLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'nurse':
        return t.nurse;
      case 'physiotherapist':
        return t.physiotherapist;
      case 'caregiver':
        return t.caregiver;
      case 'homeAssistant':
        return t.homeAssistant;
      default:
        return serviceType;
    }
  };

  const handleBookVisit = (helperId: string) => {
    const helper = helpers.find(h => h.id === helperId);
    toast.success(`Booking request sent to ${helper?.name}`);
  };

  const handleCallNow = (helperId: string) => {
    const helper = helpers.find(h => h.id === helperId);
    toast.success(`Calling ${helper?.name}...`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{t.healthcareHelpersTitle}</h1>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
          <p>Reference concept inspired by Helpee App's elder care assistants</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            {t.filterBy}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t.serviceType}</label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="nurse">{t.nurse}</SelectItem>
                  <SelectItem value="physiotherapist">{t.physiotherapist}</SelectItem>
                  <SelectItem value="caregiver">{t.caregiver}</SelectItem>
                  <SelectItem value="homeAssistant">{t.homeAssistant}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">{t.location}</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">{t.availability}</label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Times</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                  <SelectItem value="full">Full Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredHelpers.length} of {helpers.length} helpers
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Available now:</span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            {filteredHelpers.filter(h => h.isAvailable).length}
          </Badge>
        </div>
      </div>

      {/* Healthcare Helpers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHelpers.map((helper) => (
          <Card key={helper.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    {helper.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{helper.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getServiceIcon(helper.serviceType)}
                    <span className="text-sm text-muted-foreground">
                      {getServiceLabel(helper.serviceType)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {helper.isAvailable ? (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                    Busy
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <h4 className="font-medium text-sm">{t.specialization}</h4>
                <p className="text-sm text-muted-foreground">{helper.specialization}</p>
              </div>
              
              <p className="text-sm text-muted-foreground">{helper.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{helper.yearsExperience} {t.yearsExperience}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(helper.rating)}
                  <span className="ml-1 text-muted-foreground">
                    {helper.rating} ({helper.totalReviews})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {helper.location}
                </div>
                <div className="flex items-center gap-1">
                  <span>₹{helper.hourlyRate}/hour</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {helper.availability.map((slot, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {slot}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {helper.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={() => handleBookVisit(helper.id)}
                className="flex-1"
                disabled={!helper.isAvailable}
              >
                <Calendar size={16} className="mr-2" />
                {t.bookVisit}
              </Button>
              <Button 
                onClick={() => handleCallNow(helper.id)}
                variant="outline"
                className="flex-1"
              >
                <Phone size={16} className="mr-2" />
                {t.callNow}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredHelpers.length === 0 && (
        <Card className="p-12 text-center">
          <User size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg mb-2">No helpers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to find available healthcare helpers
          </p>
        </Card>
      )}
    </div>
  );
}