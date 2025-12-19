import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Bell, BellOff, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  isOnline: boolean;
  attendees: number;
  maxAttendees?: number;
  isRegistered?: boolean;
  reminderSet?: boolean;
}

export function EventsPage() {
  const { t } = useApp();
  
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Morning Yoga at City Park',
      description: 'Join us for a gentle morning yoga session suitable for all ages and abilities.',
      date: '2024-10-08',
      time: '7:00 AM',
      location: 'City Park, Main Lawn',
      isOnline: false,
      attendees: 15,
      maxAttendees: 25,
      isRegistered: false,
      reminderSet: false
    },
    {
      id: '2',
      title: 'Health Talk by Dr. Mehta',
      description: 'Learn about managing diabetes and blood pressure in seniors.',
      date: '2024-10-10',
      time: '2:00 PM',
      location: 'Community Center Hall',
      isOnline: false,
      attendees: 32,
      maxAttendees: 50,
      isRegistered: true,
      reminderSet: true
    },
    {
      id: '3',
      title: 'Online Art Session',
      description: 'Creative watercolor painting session guided by professional artist.',
      date: '2024-10-12',
      time: '10:00 AM',
      isOnline: true,
      attendees: 18,
      maxAttendees: 30,
      isRegistered: false,
      reminderSet: false
    },
    {
      id: '4',
      title: 'Walking Group - Heritage Trail',
      description: 'Leisurely walk through the historic heritage trail with guided commentary.',
      date: '2024-10-15',
      time: '6:30 AM',
      location: 'Heritage Trail Starting Point',
      isOnline: false,
      attendees: 12,
      maxAttendees: 20,
      isRegistered: false,
      reminderSet: false
    },
    {
      id: '5',
      title: 'Meditation & Mindfulness',
      description: 'Guided meditation session to reduce stress and improve mental wellbeing.',
      date: '2024-10-18',
      time: '5:00 PM',
      isOnline: true,
      attendees: 25,
      maxAttendees: 40,
      isRegistered: true,
      reminderSet: false
    }
  ]);

  const registeredEvents = events.filter(event => event.isRegistered);

  const handleAttendEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: !event.isRegistered, attendees: event.isRegistered ? event.attendees - 1 : event.attendees + 1 }
        : event
    ));
    
    const event = events.find(e => e.id === eventId);
    if (event?.isRegistered) {
      toast.success('Event registration cancelled');
    } else {
      toast.success('Successfully registered for event');
    }
  };

  const handleReminderToggle = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, reminderSet: !event.reminderSet }
        : event
    ));
    
    const event = events.find(e => e.id === eventId);
    if (event?.reminderSet) {
      toast.success('Reminder removed');
    } else {
      toast.success('Reminder set successfully');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{t.eventsAndCommunity}</h1>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
          <p>Inspired by Khyaal's senior events and engagement features</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Events List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={24} className="text-primary" />
            <h2 className="text-xl font-semibold">{t.upcomingEvents}</h2>
          </div>

          {events.map((event) => (
            <Card key={event.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    {event.isOnline && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        <Video size={12} className="mr-1" />
                        Online
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {event.attendees}{event.maxAttendees && `/${event.maxAttendees}`} {t.members}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => handleAttendEvent(event.id)}
                    variant={event.isRegistered ? "outline" : "default"}
                    className={event.isRegistered ? "border-green-500 text-green-500" : "bg-primary hover:bg-primary/90"}
                  >
                    {event.isRegistered ? t.registered : (event.isOnline ? t.joinOnline : t.attend)}
                  </Button>
                  
                  {event.isOnline && !event.isRegistered && (
                    <Button variant="outline">
                      <Video size={16} className="mr-2" />
                      {t.joinOnline}
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm">{t.remindMe}</label>
                  <Switch
                    checked={event.reminderSet}
                    onCheckedChange={() => handleReminderToggle(event.id)}
                  />
                  {event.reminderSet ? (
                    <Bell size={16} className="text-primary" />
                  ) : (
                    <BellOff size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* My Upcoming Events Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} className="text-primary" />
                {t.myUpcomingEvents}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {registeredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No registered events yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Register for events to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="p-4 bg-accent/30 rounded-lg border">
                      <h4 className="font-semibold mb-2">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar size={14} />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Clock size={14} />
                        {event.time}
                      </div>
                      {event.isOnline ? (
                        <Button size="sm" className="w-full">
                          <Video size={14} className="mr-2" />
                          {t.joinOnline}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin size={14} />
                          {event.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Events</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.registered}</span>
                  <span className="font-semibold text-green-500">{registeredEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reminders Set</span>
                  <span className="font-semibold text-blue-500">
                    {events.filter(e => e.reminderSet).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}