import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventSource, { MessageEvent } from 'react-native-sse';
import { LineChart } from '@/components/LineChart';
import { HistoryCard } from '@/components/HistoryCard';
import { X } from 'lucide-react-native';

const API_URL = 'http://103.250.10.113/api/rain/all/5';

const riskMap: Record<number, { risk: string; color: string }> = {
  [-2]: { risk: 'Nihil', color: '#6B7280' },
  [-1]: { risk: 'Error', color: '#DC2626' },
  [0]: { risk: 'Aman', color: '#10B981' },
  [1]: { risk: 'Waspada', color: '#F59E0B' },
  [2]: { risk: 'Bahaya', color: '#DC2626' },
};
const generateHistoryData = () => {
  const hours: string[] = [];
  const waterLevels: number[] = [];
  const rainData: number[] = [];

  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hours.push(hour.getHours().toString().padStart(2, '0'));
    waterLevels.push(Math.floor(Math.random() * 200) + 50);
    rainData.push(Number((Math.random() * 10).toFixed(1)));
  }

  return { hours, waterLevels, rainData };
};

interface EventItem {
  id: string | number;
  time: string;
  event: string;
  risk: string;
  color: string;
}

export default function History() {
  const [historyData] = useState(generateHistoryData());
  const [events, setEvents] = useState<EventItem[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      const es = new EventSource(API_URL, { lineEndingCharacter: '\n' });
      eventSourceRef.current = es;

      es.addEventListener('message', (event: MessageEvent) => {
        if (!isMounted) return;

        try {
          const json = JSON.parse(event.data ?? '{}');

          if (json?.status && Array.isArray(json?.data)) {
            const mapped: EventItem[] = json.data.map(
              (item: any, idx: number) => {
                const level = item?.alert_level ?? 0;
                const { risk, color } = riskMap[level] || riskMap[0];
                return {
                  id: item?.id ?? `${Date.now()}-${idx}`,
                  time: new Date(item?.CreatedAt ?? Date.now()).toLocaleString(
                    'id-ID',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  ),
                  event: `Water Level: ${item?.water_level ?? '-'} cm, Rain: ${
                    item?.rain_status ?? '-'
                  }`,
                  risk,
                  color,
                };
              }
            );
            setEvents(mapped);
          }
        } catch (err) {
          console.error('❌ SSE JSON parse error:', err);
        }
      });

      es.addEventListener('error', (e) => {
        console.error('❌ SSE Error:', e?.message || e);
      });
    } catch (err) {
      console.error('❌ Failed to init SSE:', err);
    }

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const handleClose = (id: string | number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>History & Monitoring</Text>
          <Text style={styles.subtitle}>Data 24 jam terakhir</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Level Trend</Text>
          <LineChart
            data={historyData.waterLevels}
            labels={historyData.hours}
            title="Ketinggian Air (cm)"
            color="#2563EB"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rainfall Intensity</Text>
          <LineChart
            data={historyData.rainData}
            labels={historyData.hours}
            title="Intensitas Hujan (mm/h)"
            color="#10B981"
          />
        </View>

        <View style={styles.sectionEvents}>
          <Text style={styles.sectionTitle}>Recent Events</Text>
          {events.length === 0 ? (
            <Text style={styles.emptyText}>Tidak ada alert terbaru 🎉</Text>
          ) : (
            events.map((event) => (
              <View key={event.id} style={styles.eventWrapper}>
                <HistoryCard
                  time={event.time}
                  event={event.event}
                  risk={event.risk}
                  color={event.color}
                />
                <TouchableOpacity
                  onPress={() => handleClose(event.id)}
                  style={styles.closeBtn}
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    margin: 16,
    marginTop: 2,
  },
  sectionEvents: {
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
  eventWrapper: {
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 40,
  },
});
