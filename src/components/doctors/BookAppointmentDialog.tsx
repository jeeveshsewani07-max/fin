import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Calendar, Clock, Video, User, CreditCard, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  image: string;
  location: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  date: string;
}

interface BookAppointmentDialogProps {
  doctor: Doctor | null;
  consultationType: 'online' | 'offline' | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedToPayment: (appointmentData: any) => void;
}

export function BookAppointmentDialog({
  doctor,
  consultationType,
  open,
  onOpenChange,
  onProceedToPayment
}: BookAppointmentDialogProps) {
  const { t } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Mock time slots for the next 7 days
  const generateTimeSlots = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const timeSlots: TimeSlot[] = [];
      const startHour = 9;
      const endHour = 17;
      
      for (let hour = startHour; hour < endHour; hour++) {
        ['00', '30'].forEach(minute => {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
          timeSlots.push({
            time: timeString,
            available: Math.random() > 0.3, // Random availability
            date: date.toISOString().split('T')[0]
          });
        });
      }
      
      dates.push({
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        isToday: i === 0,
        isTomorrow: i === 1,
        timeSlots
      });
    }
    
    return dates;
  };

  const timeSlotDates = generateTimeSlots();
  const selectedDateSlots = timeSlotDates.find(d => d.date === selectedDate);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !doctor) return;

    const appointmentData = {
      doctor,
      consultationType,
      date: selectedDate,
      time: selectedTime,
      notes,
      fee: doctor.consultationFee,
      appointmentId: `APT-${Date.now()}`
    };

    onProceedToPayment(appointmentData);
  };

  if (!doctor || !consultationType) {
    console.log('BookAppointmentDialog: Missing props', { doctor, consultationType });
    return null;
  }

  console.log('BookAppointmentDialog: Rendering with', { doctor: doctor.name, consultationType });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t.bookAppointment}</DialogTitle>
          <DialogDescription>
            Schedule your {consultationType === 'online' ? t.onlineConsultation : t.inPersonVisit}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t[doctor.specialty as keyof typeof t] || doctor.specialty}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {consultationType === 'online' ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {consultationType === 'online' ? t.onlineConsultation : t.inPersonVisit}
                    </span>
                    <Badge variant="secondary">₹{doctor.consultationFee}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {timeSlotDates.map((dateObj) => (
                <Button
                  key={dateObj.date}
                  variant={selectedDate === dateObj.date ? "default" : "outline"}
                  onClick={() => setSelectedDate(dateObj.date)}
                  className="p-3 h-auto flex flex-col"
                >
                  <div className="text-xs text-muted-foreground">
                    {dateObj.isToday ? t.today : dateObj.isTomorrow ? t.tomorrow : dateObj.displayDate.split(' ')[0]}
                  </div>
                  <div className="font-medium">
                    {dateObj.displayDate.split(' ').slice(1, 3).join(' ')}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                {selectedDateSlots?.timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-2 h-auto min-h-[3rem] flex flex-col justify-center ${
                      !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="font-medium text-sm">{slot.time}</span>
                    {!slot.available && (
                      <span className="text-xs text-muted-foreground">
                        Booked
                      </span>
                    )}
                  </Button>
                ))}
              </div>
              {selectedDateSlots?.timeSlots.filter(s => s.available).length === 0 && (
                <div className="text-center py-4 text-muted-foreground flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  No available slots for this date
                </div>
              )}
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <h3 className="font-semibold mb-3">Additional Notes (Optional)</h3>
            <Textarea
              placeholder="Describe your symptoms or reason for consultation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Doctor:</span>
                  <span className="font-medium">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Consultation Type:</span>
                  <span className="font-medium">
                    {consultationType === 'online' ? t.onlineConsultation : t.inPersonVisit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                {consultationType === 'offline' && (
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{doctor.location}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Fee:</span>
                  <span>₹{doctor.consultationFee}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Information */}
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                Important Information
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Please be available 5 minutes before your appointment time</li>
                <li>• Cancellation allowed up to 2 hours before appointment</li>
                {consultationType === 'online' && (
                  <li>• You'll receive a video call link via SMS and email</li>
                )}
                {consultationType === 'offline' && (
                  <li>• Please bring a valid ID and insurance documents if applicable</li>
                )}
                <li>• Consultation fee is non-refundable after the appointment starts</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
              className="flex-1"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}