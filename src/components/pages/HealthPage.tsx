import React, { useState } from 'react';
import { Pill, Activity, Video, CheckCircle, Clock, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { UpdateVitalsDialog } from '../health/UpdateVitalsDialog';
import { useApp } from '../../contexts/AppContext';

export function HealthPage() {
  const { t } = useApp();
  const [medications] = useState([
    { name: 'Metformin', dosage: '500mg', time: '8:00 AM & 8:00 PM', taken: true, nextDue: '8:00 PM' },
    { name: 'Lisinopril', dosage: '10mg', time: '9:00 AM', taken: true, nextDue: 'Tomorrow 9:00 AM' },
    { name: 'Vitamin D3', dosage: '1000 IU', time: '12:00 PM', taken: false, nextDue: 'Now' },
    { name: 'Aspirin', dosage: '75mg', time: '6:00 PM', taken: false, nextDue: '6:00 PM' }
  ]);

  const [vitals, setVitals] = useState({
    bloodPressure: { systolic: 128, diastolic: 82, status: t.normal, lastChecked: '2 hours ago' },
    heartRate: { bpm: 72, status: t.normal, lastChecked: '2 hours ago' },
    steps: { count: 4250, goal: 6000, percentage: 71 },
    sleep: { hours: 7.5, quality: t.good, lastNight: t.lastNight }
  });

  const [showUpdateVitals, setShowUpdateVitals] = useState(false);

  const handleVitalsUpdate = (updatedVitals: typeof vitals) => {
    setVitals(updatedVitals);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{t.healthWellness}</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Video size={20} className="mr-2" />
          {t.emergencyCallDoctor}
        </Button>
      </div>

      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medications">{t.medications}</TabsTrigger>
          <TabsTrigger value="vitals">{t.vitals}</TabsTrigger>
          <TabsTrigger value="doctor">{t.doctorCalls}</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill size={24} />
                {t.todaysMedications}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${med.taken ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div>
                        <h4 className="font-semibold">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">{med.dosage} • {med.time}</p>
                        <p className="text-sm text-muted-foreground">Next: {med.nextDue}</p>
                      </div>
                    </div>
                    <Button 
                      variant={med.taken ? "outline" : "default"}
                      size="sm"
                      disabled={med.taken}
                    >
                      {med.taken ? (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          {t.taken}
                        </>
                      ) : (
                        t.markAsTaken
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t.vitals}</h2>
            <Button onClick={() => setShowUpdateVitals(true)} variant="outline" size="sm">
              <Edit size={16} className="mr-2" />
              {t.updateVitals}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.bloodPressure}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold mb-2">
                  {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic} {t.mmHg}
                </div>
                <p className="text-green-600 mb-2">{vitals.bloodPressure.status}</p>
                <p className="text-sm text-muted-foreground">{t.lastChecked}: {vitals.bloodPressure.lastChecked}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.heartRate}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold mb-2">{vitals.heartRate.bpm} {t.bpm}</div>
                <p className="text-green-600 mb-2">{vitals.heartRate.status}</p>
                <p className="text-sm text-muted-foreground">{t.lastChecked}: {vitals.heartRate.lastChecked}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.dailySteps}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold mb-2">{vitals.steps.count.toLocaleString()}</div>
                <Progress value={vitals.steps.percentage} className="mb-2" />
                <p className="text-sm text-muted-foreground">{t.goal}: {vitals.steps.goal.toLocaleString()} {t.steps}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.sleep}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold mb-2">{vitals.sleep.hours} {t.hours}</div>
                <p className="text-green-600 mb-2">{vitals.sleep.quality} {t.quality}</p>
                <p className="text-sm text-muted-foreground">{vitals.sleep.lastNight}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="doctor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video size={24} />
                {t.teleconsultation}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Video size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg mb-2">{t.connectWithDoctor}</h3>
                <p className="text-muted-foreground mb-6">Start a video call with Dr. Sharma for your consultation</p>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Video size={20} className="mr-2" />
                  {t.startVideoCall}
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">{t.upcomingAppointments}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div>
                      <p className="font-medium">Dr. Sharma - General Checkup</p>
                      <p className="text-sm text-muted-foreground">Today, 7:30 PM</p>
                    </div>
                    <Button size="sm">
                      <Video size={16} className="mr-2" />
                      {t.join}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div>
                      <p className="font-medium">Dr. Patel - Cardiology</p>
                      <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Clock size={16} className="mr-2" />
                      {t.scheduled}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UpdateVitalsDialog
        open={showUpdateVitals}
        onOpenChange={setShowUpdateVitals}
        vitals={vitals}
        onVitalsUpdate={handleVitalsUpdate}
      />
    </div>
  );
}