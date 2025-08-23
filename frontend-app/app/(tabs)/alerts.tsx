import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventSource, { MessageEvent } from 'react-native-sse';
import { AlertCard } from '@/components/AlertCard';
import { NotificationSettings } from '@/components/NotificationSettings';

const API_BASE_URL = 'http://103.250.10.113';
type AlertType = 'danger' | 'warning' | 'info' | 'success';

interface AlertItem {
  id: string | number;
  time: string;
  date: string;
  title: string;
  message: string;
  type: AlertType;
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export default function Alerts() {
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [smsEnabled, setSmsEnabled] = useState<boolean>(false);
  const [warningEnabled, setWarningEnabled] = useState<boolean>(true);
  const [dangerEnabled, setDangerEnabled] = useState<boolean>(true);

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');

  const eventSourceRef = useRef<EventSource | null>(null);

  const addEmojiToTitle = (title: string, type: AlertType): string => {
    if (/^[🚨⚠️📡✅]/.test(title)) {
      return title;
    }
    switch (type) {
      case 'danger':
        return `🚨 ${title}`;
      case 'warning':
        return `⚠️ ${title}`;
      case 'info':
        return `📡 ${title}`;
      case 'success':
        return `✅ ${title}`;
      default:
        return title;
    }
  };

  const initializeSSE = useCallback(() => {
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setConnectionStatus('connecting');

      const eventSource = new EventSource(`${API_BASE_URL}/api/events`, {
        headers: {
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });

      eventSourceRef.current = eventSource;
      eventSource.addEventListener('open', () => {
        console.log('SSE Connection opened');
        setConnectionStatus('connected');
      });

      eventSource.addEventListener('notification', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);

          const shouldShowAlert =
            (data.type === 'warning' && warningEnabled) ||
            (data.type === 'danger' && dangerEnabled) ||
            data.type === 'info' ||
            data.type === 'success';

          if (shouldShowAlert) {
            const newAlert: AlertItem = {
              id: data.id ?? Date.now(),
              time: data.time,
              date: data.date,
              title: addEmojiToTitle(data.title, data.type),
              message: data.message,
              type: data.type,
            };

            setAlerts((prev) => [newAlert, ...prev]);

            if (pushEnabled) {
              Alert.alert(newAlert.title, newAlert.message, [
                { text: 'OK', style: 'default' },
              ]);
            }
          }
        } catch (error) {
          console.error('Error parsing notification data:', error);
        }
      });
      eventSource.addEventListener('error', (event: any) => {
        console.error('SSE Error:', event);
        setConnectionStatus('error');
        const newAlert: AlertItem = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
          title: addEmojiToTitle('SSE Connection Error', 'danger'),
          message:
            'Failed to connect to server (504 Gateway Timeout). Retrying...',
          type: 'danger',
        };

        setAlerts((prev) => [newAlert, ...prev]);
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          initializeSSE();
        }, 5000);
      });

      eventSource.addEventListener('close', () => {
        console.log('SSE Connection closed');
        setConnectionStatus('disconnected');
      });
    } catch (error) {
      console.error('Failed to initialize SSE:', error);
      setConnectionStatus('error');
    }
  }, [pushEnabled, warningEnabled, dangerEnabled]);

  useEffect(() => {
    initializeSSE();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [initializeSSE]);

  const handleCloseAlert = (id: string | number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollView: { flex: 1 },
  header: {
    padding: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: { flex: 1 },
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
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  badgeContainer: { flexDirection: 'row', marginTop: 4 },
  unreadBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  section: { margin: 16, marginTop: 8 },
  sectionAlerts: { margin: 16, marginTop: 8, marginBottom: 50 },
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
  emptyStateText: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
});
