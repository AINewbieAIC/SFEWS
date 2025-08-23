import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from '@/components/LineChart';
import { HistoryCard } from '@/components/HistoryCard';
import { Ionicons } from '@expo/vector-icons';

const generateHistoryData = () => {
  const hours: string[] = [];
  const waterLevels: number[] = [];
  const rainData: number[] = [];

  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hours.push(hour.getHours().toString().padStart(2, '0'));
    waterLevels.push(Math.floor(Math.random() * 200) + 50);
    rainData.push(Math.random() * 10);
  }

  return { hours, waterLevels, rainData };
};

const riskMap: Record<number, { risk: string; color: string }> = {
  [-2]: { risk: 'Nihil', color: '#6B7280' },
  [-1]: { risk: 'Error', color: '#DC2626' },
  [0]: { risk: 'Aman', color: '#10B981' },
  [1]: { risk: 'Waspada', color: '#F59E0B' },
  [2]: { risk: 'Bahaya (Evakuasi)', color: '#DC2626' },
};

export default function History() {
  const [historyData] = useState(generateHistoryData());
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://103.250.10.113/api/rain/all/5');
        const json = await res.json();

        if (json.status && json.data) {
          const mapped = json.data.map((item: any, idx: number) => {
            const level = item.alert_level ?? 0;
            const { risk, color } = riskMap[level] || riskMap[0];
            return {
              id: idx,
              time: new Date(item.CreatedAt).toLocaleString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              event: `Water Level: ${item.water_level} cm, Rain: ${item.rain_status}`,
              risk,
              color,
            };
          });
          setEvents(mapped);
        }
      } catch (err) {
        console.log('Fetch error:', err);
      }
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 100);
    return () => clearInterval(interval);
  }, []);

  const handleClose = (id: number) => {
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
          {events.map((event) => (
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
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
          {events.length === 0 && (
            <Text style={styles.emptyText}>Tidak ada alert terbaru 🎉</Text>
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
