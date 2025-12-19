import React, { useState } from 'react';
import { Settings, Type, Eye, Volume2, Globe, Users, Shield, HelpCircle, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useApp } from '../../contexts/AppContext';
import { AddFamilyMemberDialog } from '../settings/AddFamilyMemberDialog';
import { ManagePermissionsDialog } from '../settings/ManagePermissionsDialog';

export function SettingsPage() {
  const { settings, updateSettings, t, familyMembers } = useApp();
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const handleFontSizeChange = (value: number[]) => {
    updateSettings({ fontSize: value[0] });
  };

  const handleContrastChange = (value: number[]) => {
    updateSettings({ contrast: value[0] });
  };

  // Helper functions to get text labels for current values
  const getFontSizeLabel = (value: number) => {
    if (value <= 20) return t.small || 'Small';
    if (value <= 40) return t.normal;
    if (value <= 60) return t.large;
    if (value <= 80) return t.extraLarge;
    return t.extraLarge + '+';
  };

  const getContrastLabel = (value: number) => {
    if (value <= 25) return t.normal;
    if (value <= 50) return t.medium || 'Medium';
    if (value <= 75) return t.high || 'High';
    return t.extraHigh || 'Extra High';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">{t.settingsPreferences}</h1>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={24} />
            {t.accessibility}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">{t.textSize}</Label>
            <div className="space-y-3">
              <Slider
                value={[settings.fontSize]}
                onValueChange={handleFontSizeChange}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t.small || 'Small'}</span>
                <span>{t.normal}</span>
                <span>{t.large}</span>
                <span>{t.extraLarge}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.current}: {getFontSizeLabel(settings.fontSize)} ({settings.fontSize}%)
              </p>
            </div>
          </div>

          <div>
            <Label className="text-base mb-3 block">{t.contrastLevel}</Label>
            <div className="space-y-3">
              <Slider
                value={[settings.contrast]}
                onValueChange={handleContrastChange}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t.normal}</span>
                <span>{t.medium || 'Medium'}</span>
                <span>{t.high || 'High'}</span>
                <span>{t.extraHigh || 'Extra High'}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.current}: {getContrastLabel(settings.contrast)} ({settings.contrast}%)
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme" className="text-base">{t.theme}</Label>
              <p className="text-sm text-muted-foreground">
                {t.themeDesc}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ theme: 'dark' })}
                className="flex items-center gap-2"
              >
                <Moon size={16} />
                {t.darkMode}
              </Button>
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ theme: 'light' })}
                className="flex items-center gap-2"
              >
                <Sun size={16} />
                {t.lightMode}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="voice-feedback" className="text-base">{t.voiceFeedback}</Label>
              <p className="text-sm text-muted-foreground">
                {t.voiceFeedbackDesc}
              </p>
            </div>
            <Switch
              id="voice-feedback"
              checked={settings.voiceEnabled}
              onCheckedChange={(checked) => updateSettings({ voiceEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={24} />
            {t.languageRegion}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="language" className="text-base mb-3 block">{t.preferredLanguage}</Label>
            <Select
              value={settings.language}
              onValueChange={(value: 'english' | 'hindi') => updateSettings({ language: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t.selectLanguage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">{t.english}</SelectItem>
                <SelectItem value="hindi">{t.hindi}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Caregiver Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            {t.caregiverManagement}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-16 p-4"
              onClick={() => setShowAddMemberDialog(true)}
            >
              <div className="text-left">
                <p className="font-medium">{t.addFamilyMember}</p>
                <p className="text-sm text-muted-foreground">{t.grantAccessHealthData}</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 p-4"
              onClick={() => setShowPermissionsDialog(true)}
            >
              <div className="text-left">
                <p className="font-medium">{t.managePermissions}</p>
                <p className="text-sm text-muted-foreground">{t.controlWhatCaregiversSee}</p>
              </div>
            </Button>
          </div>
          
          <div className="p-4 bg-accent/50 rounded-lg">
            <h4 className="font-medium mb-2">{t.currentCaregivers}</h4>
            <div className="space-y-2 text-sm">
              {familyMembers.length > 0 ? (
                familyMembers.map((member) => (
                  <div key={member.id} className="flex justify-between">
                    <span>{member.name} ({member.relationship})</span>
                    <span className={
                      member.permissions.healthData === 'full' && 
                      member.permissions.emergencyAlerts === 'full'
                        ? "text-green-600" 
                        : "text-blue-600"
                    }>
                      {member.permissions.healthData === 'full' && 
                       member.permissions.emergencyAlerts === 'full' 
                        ? t.fullAccess 
                        : t.healthOnly}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic">No family members added yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={24} />
            {t.privacySecurity}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">{t.locationSharing}</Label>
              <p className="text-sm text-muted-foreground">
                {t.locationSharingDesc}
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">{t.healthDataSync}</Label>
              <p className="text-sm text-muted-foreground">
                {t.healthDataSyncDesc}
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">{t.callRecording}</Label>
              <p className="text-sm text-muted-foreground">
                {t.callRecordingDesc}
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Support & Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle size={24} />
            {t.supportHelp}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 p-4">
              <div className="text-left">
                <p className="font-medium">{t.tutorial}</p>
                <p className="text-sm text-muted-foreground">{t.learnHowToUse}</p>
              </div>
            </Button>
            <Button variant="outline" className="h-16 p-4">
              <div className="text-left">
                <p className="font-medium">{t.contactSupport}</p>
                <p className="text-sm text-muted-foreground">{t.getHelpFromTeam}</p>
              </div>
            </Button>
            <Button variant="outline" className="h-16 p-4">
              <div className="text-left">
                <p className="font-medium">{t.privacyPolicy}</p>
                <p className="text-sm text-muted-foreground">{t.howWeProtectData}</p>
              </div>
            </Button>
            <Button variant="outline" className="h-16 p-4">
              <div className="text-left">
                <p className="font-medium">{t.termsOfService}</p>
                <p className="text-sm text-muted-foreground">{t.ourTermsConditions}</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="space-y-2">
            <h3 className="font-semibold">Senior Assist</h3>
            <p className="text-sm text-muted-foreground">{t.version} 1.0.0</p>
            <p className="text-sm text-muted-foreground">© 2025 Senior Assist. {t.allRightsReserved}</p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-4">
              <button className="hover:text-foreground transition-colors">{t.support}</button>
              <button className="hover:text-foreground transition-colors">{t.privacy}</button>
              <button className="hover:text-foreground transition-colors">{t.terms}</button>
              <button className="hover:text-foreground transition-colors">{t.contactUs}</button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddFamilyMemberDialog
        open={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
      />
      
      <ManagePermissionsDialog
        open={showPermissionsDialog}
        onOpenChange={setShowPermissionsDialog}
      />
    </div>
  );
}