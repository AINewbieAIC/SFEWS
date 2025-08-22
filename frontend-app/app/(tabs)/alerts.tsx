import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCard } from '@/components/AlertCard';
import { NotificationSettings } from '@/components/NotificationSettings';

const initialAlerts = [
  {
    id: 1,
    time: '15:30',
    date: 'Hari ini',
    title: '🚨 Peringatan Bahaya',
    message:
      'Ketinggian air mencapai 250 cm dengan hujan deras selama 45 menit. Segera evakuasi!',
    type: 'danger',
  },
  {
    id: 2,
    time: '12:15',
    date: 'Hari ini',
    title: '⚠️ Status Waspada',
    message: 'Water level 180 cm dengan hujan sedang. Harap tetap waspada.',
    type: 'warning',
  },
  {
    id: 3,
    time: '09:45',
    date: 'Hari ini',
    title: '📡 Node Sensor Offline',
    message:
      'Koneksi dengan node sensor terputus. Melakukan reconnect otomatis.',
    type: 'info',
  },
  {
    id: 4,
    time: '21:30',
    date: 'Kemarin',
    title: '✅ Kondisi Normal',
    message: 'Status flood risk kembali ke kondisi Aman. Water level 85 cm.',
    type: 'success',
  },
];

export default function Alerts() {
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [smsEnabled, setSmsEnabled] = React.useState(false);
  const [warningEnabled, setWarningEnabled] = React.useState(true);
  const [dangerEnabled, setDangerEnabled] = React.useState(true);

  const [alerts, setAlerts] = React.useState(initialAlerts);

  const handleCloseAlert = (id: any) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Alerts & Notifications</Text>
          <View style={styles.badgeContainer}>
            {alerts.length > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{alerts.length} active</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <NotificationSettings
            pushEnabled={pushEnabled}
            setPushEnabled={setPushEnabled}
            smsEnabled={smsEnabled}
            setSmsEnabled={setSmsEnabled}
            warningEnabled={warningEnabled}
            setWarningEnabled={setWarningEnabled}
            dangerEnabled={dangerEnabled}
            setDangerEnabled={setDangerEnabled}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              time={alert.time}
              date={alert.date}
              title={alert.title}
              message={alert.message}
              type={alert.type}
              onClose={() => handleCloseAlert(alert.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  unreadBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
});
