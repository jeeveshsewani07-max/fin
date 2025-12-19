import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Clock, Video, User, Calendar, CreditCard, Phone, Shield } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DoctorProfileDialog } from "../doctors/DoctorProfileDialog";
import { BookAppointmentDialog } from "../doctors/BookAppointmentDialog";
import { PaymentDialog } from "../doctors/PaymentDialog";
import { toast } from "sonner@2.0.3";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  location: string;
  type: string; // clinic or hospital
  image: string;
  available: boolean;
  nextAvailable: string;
  languages: string[];
  onlineConsultation: boolean;
  offlineConsultation: boolean;
}

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'generalPhysician',
    experience: 15,
    rating: 4.8,
    consultationFee: 500,
    location: 'Apollo Hospital, Delhi',
    type: 'hospital',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    available: true,
    nextAvailable: 'today',
    languages: ['English', 'Hindi'],
    onlineConsultation: true,
    offlineConsultation: true
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialty: 'cardiologist',
    experience: 12,
    rating: 4.9,
    consultationFee: 800,
    location: 'Fortis Hospital, Mumbai',
    type: 'hospital',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    available: true,
    nextAvailable: 'today',
    languages: ['English', 'Hindi', 'Marathi'],
    onlineConsultation: true,
    offlineConsultation: true
  },
  {
    id: '3',
    name: 'Dr. Amit Patel',
    specialty: 'neurologist',
    experience: 20,
    rating: 4.7,
    consultationFee: 1000,
    location: 'Medanta Hospital, Gurgaon',
    type: 'hospital',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
    available: false,
    nextAvailable: 'tomorrow',
    languages: ['English', 'Hindi', 'Gujarati'],
    onlineConsultation: true,
    offlineConsultation: true
  },
  {
    id: '4',
    name: 'Dr. Sunita Singh',
    specialty: 'dermatologist',
    experience: 8,
    rating: 4.6,
    consultationFee: 600,
    location: 'City Clinic, Bangalore',
    type: 'clinic',
    image: 'https://images.unsplash.com/photo-1594824694996-a5e13c7f54bc?w=400',
    available: true,
    nextAvailable: 'today',
    languages: ['English', 'Hindi', 'Kannada'],
    onlineConsultation: true,
    offlineConsultation: true
  },
  {
    id: '5',
    name: 'Dr. Vinod Agarwal',
    specialty: 'orthopedic',
    experience: 18,
    rating: 4.8,
    consultationFee: 750,
    location: 'Max Hospital, Hyderabad',
    type: 'hospital',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
    available: true,
    nextAvailable: 'today',
    languages: ['English', 'Hindi', 'Telugu'],
    onlineConsultation: false,
    offlineConsultation: true
  },
  {
    id: '6',
    name: 'Dr. Meera Reddy',
    specialty: 'psychiatrist',
    experience: 10,
    rating: 4.9,
    consultationFee: 900,
    location: 'Mind Care Clinic, Chennai',
    type: 'clinic',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400',
    available: true,
    nextAvailable: 'today',
    languages: ['English', 'Hindi', 'Tamil'],
    onlineConsultation: true,
    offlineConsultation: true
  }
];

const specialties = [
  'allSpecialties',
  'generalPhysician',
  'cardiologist',
  'neurologist',
  'orthopedic',
  'dermatologist',
  'psychiatrist',
  'pediatrician',
  'gynecologist',
  'urologist',
  'ophthalmologist',
  'ent'
];

const consultationTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'online', label: 'onlineConsultation' },
  { value: 'offline', label: 'offlineVisit' }
];

export function FindDoctorPage() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('allSpecialties');
  const [selectedConsultationType, setSelectedConsultationType] = useState('all');
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);
  
  // Dialog states
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [bookingConsultationType, setBookingConsultationType] = useState<'online' | 'offline' | null>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  // Filter doctors based on search criteria
  React.useEffect(() => {
    let filtered = mockDoctors;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t[doctor.specialty as keyof typeof t].toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== 'allSpecialties') {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }

    // Filter by consultation type
    if (selectedConsultationType === 'online') {
      filtered = filtered.filter(doctor => doctor.onlineConsultation);
    } else if (selectedConsultationType === 'offline') {
      filtered = filtered.filter(doctor => doctor.offlineConsultation);
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, selectedSpecialty, selectedConsultationType, t]);

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileDialog(true);
  };

  const handleBookAppointment = (doctor: Doctor, consultationType: 'online' | 'offline') => {
    setSelectedDoctor(doctor);
    setBookingConsultationType(consultationType);
    setShowBookingDialog(true);
  };

  const handleProceedToPayment = (appointmentData: any) => {
    setAppointmentData(appointmentData);
    setShowBookingDialog(false);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    toast.success("Appointment booked successfully!", {
      description: `Payment ID: ${paymentId}. You will receive confirmation details via SMS and email.`
    });
    
    // Reset states
    setSelectedDoctor(null);
    setBookingConsultationType(null);
    setAppointmentData(null);
    setShowPaymentDialog(false);
  };

  const renderDoctorCard = (doctor: Doctor) => (
    <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{doctor.name}</CardTitle>
                <CardDescription className="mt-1">
                  {t[doctor.specialty as keyof typeof t]}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{doctor.rating}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {doctor.experience} {t.yearsExp}
                  </span>
                </div>
              </div>
              <Badge variant={doctor.available ? "default" : "secondary"}>
                {doctor.available ? t.available : t.unavailable}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{doctor.location}</span>
            <Badge variant="outline" className="ml-2">
              {doctor.type === 'hospital' ? t.hospital : t.clinic}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{t.nextAvailable}: {t[doctor.nextAvailable as keyof typeof t]}</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              <span>₹{doctor.consultationFee}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {doctor.onlineConsultation && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBookAppointment(doctor, 'online')}
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                {t.onlineConsultation}
              </Button>
            )}
            {doctor.offlineConsultation && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBookAppointment(doctor, 'offline')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {t.inPersonVisit}
              </Button>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              {t.bookAppointment}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleViewProfile(doctor)}
            >
              {t.viewProfile}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">{t.findDoctors}</h1>
        <p className="text-muted-foreground mt-1">{t.findQualifiedDoctors}</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t.searchDoctors}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select
                  value={selectedSpecialty}
                  onValueChange={setSelectedSpecialty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectSpecialty} />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {t[specialty as keyof typeof t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select
                  value={selectedConsultationType}
                  onValueChange={setSelectedConsultationType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.consultationType} />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.value === 'all' ? 'All Types' : t[type.label as keyof typeof t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">
            {filteredDoctors.length} doctors found
          </h2>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Doctors</TabsTrigger>
            <TabsTrigger value="available">Available Today</TabsTrigger>
            <TabsTrigger value="online">Online Only</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredDoctors.map(renderDoctorCard)}
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            {filteredDoctors
              .filter(doctor => doctor.available)
              .map(renderDoctorCard)}
          </TabsContent>

          <TabsContent value="online" className="space-y-4">
            {filteredDoctors
              .filter(doctor => doctor.onlineConsultation)
              .map(renderDoctorCard)}
          </TabsContent>
        </Tabs>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No doctors found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Methods Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t.paymentMethods}</CardTitle>
          <CardDescription>
            We accept multiple payment methods for your convenience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { key: 'creditCard', icon: CreditCard },
              { key: 'debitCard', icon: CreditCard },
              { key: 'digitalWallet', icon: Phone },
              { key: 'insurance', icon: Shield },
              { key: 'cash', icon: CreditCard }
            ].map(({ key, icon: Icon }) => (
              <div key={key} className="flex items-center gap-2 p-3 rounded-lg border">
                <Icon className="w-4 h-4" />
                <span className="text-sm">{t[key as keyof typeof t]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DoctorProfileDialog
        doctor={selectedDoctor}
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        onBookAppointment={handleBookAppointment}
      />

      <BookAppointmentDialog
        doctor={selectedDoctor}
        consultationType={bookingConsultationType}
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        onProceedToPayment={handleProceedToPayment}
      />

      <PaymentDialog
        appointmentData={appointmentData}
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}