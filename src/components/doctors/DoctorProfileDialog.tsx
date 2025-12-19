import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Mail, 
  Calendar, 
  GraduationCap, 
  Award, 
  Users, 
  Video,
  User,
  Languages,
  Building
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  location: string;
  type: string;
  image: string;
  available: boolean;
  nextAvailable: string;
  languages: string[];
  onlineConsultation: boolean;
  offlineConsultation: boolean;
  // Extended profile information
  education?: string[];
  certifications?: string[];
  phone?: string;
  email?: string;
  about?: string;
  specializations?: string[];
  consultedPatients?: number;
  clinicAddress?: string;
  workingHours?: string;
  awards?: string[];
}

interface DoctorProfileDialogProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookAppointment: (doctor: Doctor, type: 'online' | 'offline') => void;
}

export function DoctorProfileDialog({ 
  doctor, 
  open, 
  onOpenChange, 
  onBookAppointment 
}: DoctorProfileDialogProps) {
  const { t } = useApp();

  if (!doctor) return null;

  // Mock extended data for demonstration
  const extendedDoctor = {
    ...doctor,
    education: ['MBBS - All India Institute of Medical Sciences, Delhi', 'MD - Internal Medicine, AIIMS Delhi'],
    certifications: ['Board Certified Internal Medicine', 'Advanced Cardiac Life Support (ACLS)', 'Indian Medical Association Member'],
    phone: '+91 98765 43210',
    email: 'dr.rajesh@hospital.com',
    about: 'Dr. Rajesh Kumar is a highly experienced physician with over 15 years of practice in internal medicine. He specializes in preventive care, chronic disease management, and geriatric medicine. Known for his compassionate approach and thorough diagnostic skills.',
    specializations: ['Preventive Care', 'Chronic Disease Management', 'Geriatric Medicine', 'Diabetes Care'],
    consultedPatients: 2500,
    clinicAddress: 'Apollo Hospital, Sarita Vihar, New Delhi - 110076',
    workingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
    awards: ['Best Doctor Award 2023', 'Excellence in Patient Care 2022', 'Medical Innovation Award 2021']
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t.viewProfile}</DialogTitle>
          <DialogDescription>
            Complete profile and credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={extendedDoctor.image}
                alt={extendedDoctor.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{extendedDoctor.name}</h2>
                <p className="text-muted-foreground">{t[extendedDoctor.specialty as keyof typeof t]}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{extendedDoctor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{extendedDoctor.experience} {t.yearsExp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{extendedDoctor.consultedPatients}+ patients</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Badge variant={extendedDoctor.available ? "default" : "secondary"}>
                    {extendedDoctor.available ? t.available : t.unavailable}
                  </Badge>
                  <Badge variant="outline">
                    {extendedDoctor.type === 'hospital' ? t.hospital : t.clinic}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {extendedDoctor.onlineConsultation && (
                  <Button
                    onClick={() => onBookAppointment(extendedDoctor, 'online')}
                    className="flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    {t.onlineConsultation} - ₹{extendedDoctor.consultationFee}
                  </Button>
                )}
                {extendedDoctor.offlineConsultation && (
                  <Button
                    variant="outline"
                    onClick={() => onBookAppointment(extendedDoctor, 'offline')}
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {t.inPersonVisit} - ₹{extendedDoctor.consultationFee}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* About Section */}
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{extendedDoctor.about}</p>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{extendedDoctor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{extendedDoctor.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span>{extendedDoctor.clinicAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{extendedDoctor.workingHours}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Additional Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  <span>{extendedDoctor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{extendedDoctor.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Next Available: {t[extendedDoctor.nextAvailable as keyof typeof t]}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Education */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Education
            </h3>
            <div className="space-y-2">
              {extendedDoctor.education?.map((edu, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <p>{edu}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="font-semibold mb-3">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {extendedDoctor.specializations?.map((spec, index) => (
                <Badge key={index} variant="outline">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-semibold mb-3">Certifications & Memberships</h3>
            <div className="space-y-2">
              {extendedDoctor.certifications?.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          {extendedDoctor.awards && extendedDoctor.awards.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Awards & Recognition</h3>
              <div className="space-y-2">
                {extendedDoctor.awards.map((award, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {extendedDoctor.onlineConsultation && (
              <Button
                onClick={() => onBookAppointment(extendedDoctor, 'online')}
                className="flex-1"
              >
                <Video className="w-4 h-4 mr-2" />
                Book Online Consultation
              </Button>
            )}
            {extendedDoctor.offlineConsultation && (
              <Button
                variant="outline"
                onClick={() => onBookAppointment(extendedDoctor, 'offline')}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                Book In-Person Visit
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}