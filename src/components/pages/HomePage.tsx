import React from 'react';
import { Heart, MessageCircle, Car, Receipt, CheckCircle, Clock, Stethoscope, Calendar, Users, UserCheck } from 'lucide-react';
import { ModuleCard } from '../shared/ModuleCard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useApp } from '../../contexts/AppContext';

export function HomePage() {
  const { setCurrentPage, userName, t } = useApp();

  const modules = [
    {
      id: 'health',
      title: t.medicinesReminders,
      description: t.trackMedicationsHealth,
      icon: Heart,
      color: '#4F46E5'
    },
    {
      id: 'findDoctor',
      title: t.findDoctor,
      description: t.findQualifiedDoctors,
      icon: Stethoscope,
      color: '#DC2626'
    },
    {
      id: 'chat',
      title: t.chatCalls,
      description: t.connectFamilyDoctors,
      icon: MessageCircle,
      color: '#16A34A'
    },
    {
      id: 'rides',
      title: t.ridesTransport,
      description: t.bookCabsBusTimings,
      icon: Car,
      color: '#D97706'
    },
    {
      id: 'bills',
      title: t.billsPayments,
      description: t.payBillsViewHistory,
      icon: Receipt,
      color: '#7C3AED'
    },
    {
      id: 'events',
      title: t.events,
      description: 'Join community events and activities',
      icon: Calendar,
      color: '#0891B2'
    },
    {
      id: 'community',
      title: t.community,
      description: 'Connect with social groups and friends',
      icon: Users,
      color: '#059669'
    },
    {
      id: 'healthcareHelpers',
      title: t.healthcareHelpers,
      description: 'Find verified healthcare assistants',
      icon: UserCheck,
      color: '#EA580C'
    }
  ];

  const upcomingTasks = [
    { time: '6:00 PM', task: 'Take evening medication', type: 'medicine', completed: false },
    { time: '7:30 PM', task: 'Video call with Dr. Sharma', type: 'appointment', completed: false },
    { time: '8:00 PM', task: 'Pay electricity bill', type: 'bill', completed: false },
    { time: 'Today', task: 'Morning walk completed', type: 'exercise', completed: true }
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 lg:p-8 rounded-2xl text-white bg-[rgba(0,0,0,0)]">
        <h1 className="text-2xl lg:text-3xl mb-2">{getTimeGreeting()}, {userName} 👋</h1>
        <p className="text-primary-foreground/90 text-lg">{t.howCanIHelp}</p>
      </div>

      {/* Core Modules */}
      <div>
        <h2 className="text-xl mb-6">{t.quickAccess}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              color={module.color}
              onClick={() => setCurrentPage(module.id)}
              buttonText={t.open}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={24} />
            {t.upcomingTasks}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${task.completed ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                  <div>
                    <p className={`${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.task}
                    </p>
                    <p className="text-sm text-muted-foreground">{task.time}</p>
                  </div>
                </div>
                {!task.completed && (
                  <Button size="sm" variant="outline">
                    <CheckCircle size={16} className="mr-2" />
                    {t.markDone}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}