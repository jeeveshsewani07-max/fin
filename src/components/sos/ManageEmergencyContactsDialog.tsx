import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Phone, Mail, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relation: string;
  priority: 'primary' | 'secondary' | 'tertiary';
  isVerified: boolean;
}

interface ManageEmergencyContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: EmergencyContact[];
  onContactsUpdate: (contacts: EmergencyContact[]) => void;
}

export function ManageEmergencyContactsDialog({ 
  open, 
  onOpenChange, 
  contacts, 
  onContactsUpdate 
}: ManageEmergencyContactsDialogProps) {
  const { t } = useApp();
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relation: '',
    priority: 'secondary' as const
  });

  const relationOptions = [
    t.son,
    t.daughter, 
    t.spouse,
    t.parent,
    t.sibling,
    t.doctor,
    t.caregiver,
    t.neighbor,
    t.friend,
    t.other
  ];

  const priorityOptions = [
    { value: 'primary', label: `${t.primary} (Called First)`, color: 'bg-red-600' },
    { value: 'secondary', label: t.secondary, color: 'bg-orange-600' },
    { value: 'tertiary', label: t.tertiary, color: 'bg-blue-600' }
  ];

  const handleAddContact = () => {
    setIsAddMode(true);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      relation: '',
      priority: 'secondary'
    });
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setIsAddMode(false);
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      relation: contact.relation,
      priority: contact.priority
    });
  };

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    onContactsUpdate(updatedContacts);
    toast.success(t.emergencyContactDeleted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.relation) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isAddMode) {
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        relation: formData.relation,
        priority: formData.priority,
        isVerified: false
      };
      
      onContactsUpdate([...contacts, newContact]);
      toast.success(t.emergencyContactAdded);
    } else if (editingContact) {
      const updatedContacts = contacts.map(c => 
        c.id === editingContact.id 
          ? { ...c, ...formData }
          : c
      );
      onContactsUpdate(updatedContacts);
      toast.success(t.emergencyContactUpdated);
    }

    setIsAddMode(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      relation: '',
      priority: 'secondary'
    });
  };

  const handleVerifyContact = (contactId: string) => {
    const updatedContacts = contacts.map(c => 
      c.id === contactId 
        ? { ...c, isVerified: !c.isVerified }
        : c
    );
    onContactsUpdate(updatedContacts);
    toast.success('Contact verification status updated');
  };

  const getPriorityInfo = (priority: string) => {
    return priorityOptions.find(p => p.value === priority) || priorityOptions[1];
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const priorityOrder = { primary: 0, secondary: 1, tertiary: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={24} />
            {t.manageEmergencyContactsTitle}
          </DialogTitle>
          <DialogDescription>
            {t.manageEmergencyContactsDesc}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Add/Edit Form */}
          {(isAddMode || editingContact) && (
            <Card className="border-primary">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t.fullName} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.enterFullName}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t.phoneNumber} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">{t.emailOptional}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relation">{t.relationship} *</Label>
                      <Select
                        value={formData.relation}
                        onValueChange={(value) => setFormData({ ...formData, relation: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectRelationship} />
                        </SelectTrigger>
                        <SelectContent>
                          {relationOptions.map((relation) => (
                            <SelectItem key={relation} value={relation}>
                              {relation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="priority">{t.priorityLevel}</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      {isAddMode ? t.addContact : t.updateContact}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddMode(false);
                        setEditingContact(null);
                      }}
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Contacts List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t.yourEmergencyContacts} ({contacts.length})</h3>
              {!isAddMode && !editingContact && (
                <Button onClick={handleAddContact} size="sm">
                  <Plus size={16} className="mr-2" />
                  {t.addContact}
                </Button>
              )}
            </div>

            {sortedContacts.length > 0 ? (
              <div className="space-y-3">
                {sortedContacts.map((contact) => {
                  const priorityInfo = getPriorityInfo(contact.priority);
                  return (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                {contact.name.charAt(0)}
                              </div>
                              {contact.isVerified && (
                                <UserCheck 
                                  size={16} 
                                  className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1" 
                                />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{contact.name}</p>
                                <div className={`w-2 h-2 rounded-full ${priorityInfo.color}`} />
                              </div>
                              <p className="text-sm text-muted-foreground">{contact.relation}</p>
                              <div className="flex flex-col gap-1 mt-1">
                                <div className="flex items-center gap-2">
                                  <Phone size={14} />
                                  <span className="text-sm font-medium">{contact.phone}</span>
                                </div>
                                {contact.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail size={14} />
                                    <span className="text-sm">{contact.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={contact.isVerified ? 'default' : 'secondary'}>
                              {contact.isVerified ? t.verified : t.unverified}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyContact(contact.id)}
                                title={t.toggleVerification}
                              >
                                <UserCheck size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditContact(contact)}
                                title={t.editContact}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteContact(contact.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                title={t.deleteContact}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">{t.noEmergencyContactsYet}</p>
                <Button onClick={handleAddContact}>
                  <Plus size={16} className="mr-2" />
                  {t.addYourFirstContact}
                </Button>
              </div>
            )}
          </div>

          {/* Important Notes */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">{t.importantNotes}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t.primaryContactsFirst}</li>
                <li>• {t.verifyContactsRegularly}</li>
                <li>• {t.contactsDifferentLocations}</li>
                <li>• {t.includeMedicalProfessional}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            {t.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}