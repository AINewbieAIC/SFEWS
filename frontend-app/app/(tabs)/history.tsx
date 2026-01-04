import React from 'react';
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
import { X } from 'lucide-react-native';
import { useHistory } from '@/hooks/useHistory';

export default function History() {
  const { historyData, events, handleClose } = useHistory();

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
