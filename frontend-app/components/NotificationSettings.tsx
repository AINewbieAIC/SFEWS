import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Smartphone, MessageSquare, TriangleAlert as AlertTriangle, OctagonAlert as AlertOctagon } from 'lucide-react-native';

interface NotificationSettingsProps {
  pushEnabled: boolean;
  setPushEnabled: (value: boolean) => void;
  smsEnabled: boolean;
  setSmsEnabled: (value: boolean) => void;
  warningEnabled: boolean;
  setWarningEnabled: (value: boolean) => void;
  dangerEnabled: boolean;
  setDangerEnabled: (value: boolean) => void;
}

export function NotificationSettings({
  pushEnabled,
  setPushEnabled,
  smsEnabled,
  setSmsEnabled,
  warningEnabled,
  setWarningEnabled,
  dangerEnabled,
  setDangerEnabled,
}: NotificationSettingsProps) {
  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onValueChange 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        {icon}
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SettingItem
        icon={<Smartphone size={20} color="#3B82F6" />}
        title="Push Notifications"
        description="Terima notifikasi langsung di aplikasi"
        value={pushEnabled}
        onValueChange={setPushEnabled}
      />
      
      <SettingItem
        icon={<MessageSquare size={20} color="#10B981" />}
        title="SMS Alerts"
        description="Terima SMS untuk peringatan darurat"
        value={smsEnabled}
        onValueChange={setSmsEnabled}
      />
      
      <View style={styles.separator} />
      
      <Text style={styles.sectionTitle}>Alert Types</Text>
      
      <SettingItem
        icon={<AlertTriangle size={20} color="#F59E0B" />}
        title="Warning Alerts"
        description="Notifikasi untuk status Waspada"
        value={warningEnabled}
        onValueChange={setWarningEnabled}
      />
      
      <SettingItem
        icon={<AlertOctagon size={20} color="#DC2626" />}
        title="Danger Alerts"
        description="Notifikasi untuk status Bahaya"
        value={dangerEnabled}
        onValueChange={setDangerEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
});