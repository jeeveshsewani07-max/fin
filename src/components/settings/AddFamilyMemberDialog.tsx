import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useApp } from '../../contexts/AppContext';

interface AddFamilyMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFamilyMemberDialog({ open, onOpenChange }: AddFamilyMemberDialogProps) {
  const { addFamilyMember, t } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const relationships = [
    { value: 'son', label: t.son },
    { value: 'daughter', label: t.daughter },
    { value: 'spouse', label: t.spouse },
    { value: 'sibling', label: t.sibling },
    { value: 'parent', label: t.parent },
    { value: 'grandchild', label: t.grandchild },
    { value: 'caregiver', label: t.caregiver },
    { value: 'doctor', label: t.doctor },
    { value: 'friend', label: t.friend },
    { value: 'other', label: t.other }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.pleaseEnterName;
    }
    if (!formData.relationship) {
      newErrors.relationship = t.pleaseSelectRelationship;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t.pleaseEnterPhone;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Default permissions - full access for family, limited for doctors
    const defaultPermissions = formData.relationship === 'doctor' ? {
      healthData: 'full' as const,
      medicationReminders: 'view' as const,
      emergencyAlerts: 'view' as const,
      locationTracking: 'none' as const,
      callHistory: 'none' as const,
      appointmentScheduling: 'full' as const
    } : {
      healthData: 'full' as const,
      medicationReminders: 'full' as const,
      emergencyAlerts: 'full' as const,
      locationTracking: 'full' as const,
      callHistory: 'view' as const,
      appointmentScheduling: 'full' as const
    };

    addFamilyMember({
      name: formData.name,
      relationship: relationships.find(r => r.value === formData.relationship)?.label || formData.relationship,
      phone: formData.phone,
      email: formData.email || undefined,
      permissions: defaultPermissions
    });

    // Reset form
    setFormData({ name: '', relationship: '', phone: '', email: '' });
    setErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.addNewFamilyMember}</DialogTitle>
          <DialogDescription>
            {t.addFamilyMemberDesc}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base">
                {t.familyMemberName} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="relationship" className="text-base">
                {t.relationship} *
              </Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => handleInputChange('relationship', value)}
              >
                <SelectTrigger className={errors.relationship ? 'border-destructive' : ''}>
                  <SelectValue placeholder={t.selectRelationship} />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel.value} value={rel.value}>
                      {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.relationship && (
                <p className="text-sm text-destructive mt-1">{errors.relationship}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-base">
                {t.phoneNumber} *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-base">
                {t.emailAddress}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit}>
            {t.add}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}