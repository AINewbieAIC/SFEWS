import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCard } from '@/components/AlertCard';
import { NotificationSettings } from '@/components/NotificationSettings';
import { useAlerts } from '@/hooks/useAlerts';

export default function Alerts() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [warningEnabled, setWarningEnabled] = useState(true);
  const [dangerEnabled, setDangerEnabled] = useState(true);

  const { alerts, connectionStatus, handleCloseAlert } = useAlerts(
    pushEnabled,
    warningEnabled,
    dangerEnabled
  );

  React.useEffect(() => {
    if (pushEnabled && alerts.length > 0) {
      const lastAlert = alerts[0];
      if (lastAlert) {
        Alert.alert(lastAlert.title, lastAlert.message, [
          { text: 'OK', style: 'default' },
        ]);
      }
    }
  }, [alerts, pushEnabled]);

  const getConnectionStatusStyle = () => {
    switch (connectionStatus) {
      case 'connected':
        return { backgroundColor: '#10B981', text: 'Connected' };
      case 'connecting':
        return { backgroundColor: '#F59E0B', text: 'Connecting...' };
      case 'error':
        return { backgroundColor: '#EF4444', text: 'Error' };
      default:
        return { backgroundColor: '#6B7280', text: 'Disconnected' };
    }
  };

  const statusStyle = getConnectionStatusStyle();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Alerts & Notifications</Text>
            <View style={styles.connectionStatus}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusStyle.backgroundColor },
                ]}
              />
              <Text style={styles.statusText}>{statusStyle.text}</Text>
            </View>
          </View>
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

        <View style={styles.sectionAlerts}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {alerts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent alerts</Text>
            </View>
          ) : (
            alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                time={alert.time}
                date={alert.date}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                onClose={() => handleCloseAlert(alert.id)}
              />
            ))
          )}
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
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
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
  sectionAlerts: {
    margin: 16,
    marginTop: 8,
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});
