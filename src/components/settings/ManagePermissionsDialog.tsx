import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface ManagePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PermissionLevel = 'full' | 'view' | 'none';

export function ManagePermissionsDialog({ open, onOpenChange }: ManagePermissionsDialogProps) {
  const { familyMembers, updateFamilyMemberPermissions, removeFamilyMember, t } = useApp();
  const [hasChanges, setHasChanges] = useState(false);
  const [localPermissions, setLocalPermissions] = useState(
    familyMembers.reduce((acc, member) => {
      acc[member.id] = { ...member.permissions };
      return acc;
    }, {} as Record<string, any>)
  );

  const permissionCategories = [
    { key: 'healthData', label: t.healthData },
    { key: 'medicationReminders', label: t.medicationReminders },
    { key: 'emergencyAlerts', label: t.emergencyAlerts },
    { key: 'locationTracking', label: t.locationTracking },
    { key: 'callHistory', label: t.callHistory },
    { key: 'appointmentScheduling', label: t.appointmentScheduling }
  ];

  const permissionLevels = [
    { value: 'full', label: t.fullAccess, color: 'bg-green-500' },
    { value: 'view', label: t.viewOnly, color: 'bg-blue-500' },
    { value: 'none', label: t.noAccess, color: 'bg-gray-500' }
  ];

  const getPermissionColor = (level: PermissionLevel) => {
    switch (level) {
      case 'full': return 'text-green-600';
      case 'view': return 'text-blue-600';
      case 'none': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPermissionLabel = (level: PermissionLevel) => {
    switch (level) {
      case 'full': return t.fullAccess;
      case 'view': return t.viewOnly;
      case 'none': return t.noAccess;
      default: return t.noAccess;
    }
  };

  const handlePermissionChange = (memberId: string, category: string, level: PermissionLevel) => {
    setLocalPermissions(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [category]: level
      }
    }));
    setHasChanges(true);
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this family member? This action cannot be undone.')) {
      removeFamilyMember(memberId);
      const { [memberId]: removed, ...rest } = localPermissions;
      setLocalPermissions(rest);
      setHasChanges(true);
    }
  };

  const handleSaveChanges = () => {
    Object.entries(localPermissions).forEach(([memberId, permissions]) => {
      updateFamilyMemberPermissions(memberId, permissions);
    });
    setHasChanges(false);
  };

  const handleCancel = () => {
    // Reset to original permissions
    setLocalPermissions(
      familyMembers.reduce((acc, member) => {
        acc[member.id] = { ...member.permissions };
        return acc;
      }, {} as Record<string, any>)
    );
    setHasChanges(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.manageAccessPermissions}</DialogTitle>
          <DialogDescription>
            {t.permissionDesc}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {member.relationship} • {member.phone}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {permissionCategories.map((category) => (
                      <div key={category.key} className="space-y-2">
                        <label className="text-sm font-medium">
                          {category.label}
                        </label>
                        <Select
                          value={localPermissions[member.id]?.[category.key] || 'none'}
                          onValueChange={(value: PermissionLevel) => 
                            handlePermissionChange(member.id, category.key, value)
                          }
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {permissionLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${level.color}`} />
                                  {level.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  
                  {/* Current permissions summary */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {permissionCategories.map((category) => {
                        const level = localPermissions[member.id]?.[category.key] || 'none';
                        return (
                          <Badge
                            key={category.key}
                            variant="outline"
                            className={`${getPermissionColor(level)} border-current`}
                          >
                            {category.label}: {getPermissionLabel(level)}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {familyMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No family members added yet. Add a family member to manage their permissions.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSaveChanges}
            disabled={!hasChanges}
          >
            {t.updatePermissions}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}