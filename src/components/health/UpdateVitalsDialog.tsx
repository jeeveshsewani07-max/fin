import React, { useState } from 'react';
import { Activity, Heart, TrendingUp, Moon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface Vitals {
  bloodPressure: { systolic: number; diastolic: number; status: string; lastChecked: string };
  heartRate: { bpm: number; status: string; lastChecked: string };
  steps: { count: number; goal: number; percentage: number };
  sleep: { hours: number; quality: string; lastNight: string };
}

interface UpdateVitalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vitals: Vitals;
  onVitalsUpdate: (vitals: Vitals) => void;
}

export function UpdateVitalsDialog({ 
  open, 
  onOpenChange, 
  vitals, 
  onVitalsUpdate 
}: UpdateVitalsDialogProps) {
  const { t } = useApp();
  const [formData, setFormData] = useState({
    systolic: vitals.bloodPressure.systolic.toString(),
    diastolic: vitals.bloodPressure.diastolic.toString(),
    heartRate: vitals.heartRate.bpm.toString(),
    steps: vitals.steps.count.toString(),
    sleepHours: vitals.sleep.hours.toString(),
    sleepQuality: vitals.sleep.quality
  });

  const sleepQualityOptions = [
    { value: 'Excellent', label: t.excellent },
    { value: 'Good', label: t.good },
    { value: 'Fair', label: t.fair },
    { value: 'Poor', label: t.poor }
  ];

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return t.normal;
    if (systolic < 130 && diastolic < 80) return 'Elevated';
    if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) return 'Stage 1 High';
    if (systolic >= 140 || diastolic >= 90) return 'Stage 2 High';
    return t.normal;
  };

  const getHeartRateStatus = (bpm: number) => {
    if (bpm >= 60 && bpm <= 100) return t.normal;
    if (bpm < 60) return 'Low';
    return 'High';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const systolic = parseInt(formData.systolic);
    const diastolic = parseInt(formData.diastolic);
    const heartRate = parseInt(formData.heartRate);
    const steps = parseInt(formData.steps);
    const sleepHours = parseFloat(formData.sleepHours);

    if (isNaN(systolic) || isNaN(diastolic) || isNaN(heartRate) || isNaN(steps) || isNaN(sleepHours)) {
      toast.error('Please enter valid numbers for all fields');
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lastChecked = `${t.lastUpdated} ${timeString}`;

    const updatedVitals: Vitals = {
      bloodPressure: {
        systolic,
        diastolic,
        status: getBloodPressureStatus(systolic, diastolic),
        lastChecked
      },
      heartRate: {
        bpm: heartRate,
        status: getHeartRateStatus(heartRate),
        lastChecked
      },
      steps: {
        count: steps,
        goal: vitals.steps.goal,
        percentage: Math.round((steps / vitals.steps.goal) * 100)
      },
      sleep: {
        hours: sleepHours,
        quality: formData.sleepQuality,
        lastNight: vitals.sleep.lastNight
      }
    };

    onVitalsUpdate(updatedVitals);
    toast.success(t.updateVitalsSuccess);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity size={24} />
            {t.updateVitals}
          </DialogTitle>
          <DialogDescription>
            {t.updateVitalsDesc}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blood Pressure */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart size={20} className="text-red-500" />
                <h3 className="font-semibold">{t.bloodPressure}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolic">{t.systolicPressure}</Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    placeholder={t.enterValue}
                    min="60"
                    max="200"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic">{t.diastolicPressure}</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    placeholder={t.enterValue}
                    min="40"
                    max="130"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heart Rate */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-blue-500" />
                <h3 className="font-semibold">{t.heartRate}</h3>
              </div>
              <div>
                <Label htmlFor="heartRate">{t.heartRateBpm}</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  placeholder={t.enterValue}
                  min="40"
                  max="200"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Daily Steps */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-green-500" />
                <h3 className="font-semibold">{t.dailySteps}</h3>
              </div>
              <div>
                <Label htmlFor="steps">{t.dailyStepsCount}</Label>
                <Input
                  id="steps"
                  type="number"
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  placeholder={t.enterValue}
                  min="0"
                  max="50000"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Sleep */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Moon size={20} className="text-purple-500" />
                <h3 className="font-semibold">{t.sleep}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sleepHours">{t.sleepHours}</Label>
                  <Input
                    id="sleepHours"
                    type="number"
                    step="0.5"
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                    placeholder={t.enterValue}
                    min="0"
                    max="24"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sleepQuality">{t.sleepQuality}</Label>
                  <Select
                    value={formData.sleepQuality}
                    onValueChange={(value) => setFormData({ ...formData, sleepQuality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sleepQualityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {t.updateVitals}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              {t.cancel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}