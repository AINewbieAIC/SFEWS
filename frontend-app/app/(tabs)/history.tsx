import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from '@/components/LineChart';
import { HistoryCard } from '@/components/HistoryCard';

const { width: screenWidth } = Dimensions.get('window');

const generateHistoryData = () => {
  const hours = [];
  const waterLevels = [];
  const rainData = [];

  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hours.push(hour.getHours().toString().padStart(2, '0'));
    waterLevels.push(Math.floor(Math.random() * 200) + 50);
    rainData.push(Math.random() * 10);
  }

  return { hours, waterLevels, rainData };
};

const recentEvents = [
  {
    id: 1,
    time: '2 jam lalu',
    event: 'Water Level Mencapai 180 cm',
    risk: 'Waspada',
    color: '#F59E0B',
  },
  {
    id: 2,
    time: '4 jam lalu',
    event: 'Hujan Deras Dimulai',
    risk: 'Info',
    color: '#3B82F6',
  },
  {
    id: 3,
    time: '6 jam lalu',
    event: 'Node Sensor Offline',
    risk: 'Peringatan',
    color: '#DC2626',
  },
  {
    id: 4,
    time: '8 jam lalu',
    event: 'Kondisi Normal',
    risk: 'Aman',
    color: '#10B981',
  },
];

export default function History() {
  const [historyData] = useState(generateHistoryData());

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Events</Text>
          {recentEvents.map((event) => (
            <HistoryCard
              key={event.id}
              time={event.time}
              event={event.event}
              risk={event.risk}
              color={event.color}
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
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
});
