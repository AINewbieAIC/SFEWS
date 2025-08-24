import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventSource from 'react-native-sse';
import { StatusCard } from '@/components/StatusCard';
import { WaterLevelCard } from '@/components/WaterLevelCard';
import { RainStatusCard } from '@/components/RainStatusCard';
import { FloodRiskCard } from '@/components/FloodRiskCard';
import { Header } from '@/components/Header';

const API_BASE = 'http://103.250.10.113';
const RAIN_STATUS_TEXT = ['Tidak Hujan', 'Gerimis', 'Sedang', 'Deras'];

const mapAlertLevel = (level: number) => {
  switch (level) {
    case -2:
      return { riskLevel: 'Nihil', riskColor: '#6B7280' };
    case -1:
      return { riskLevel: 'Error', riskColor: '#DC2626' };
    case 0:
      return { riskLevel: 'Aman', riskColor: '#10B981' };
    case 1:
      return { riskLevel: 'Waspada', riskColor: '#F59E0B' };
    case 2:
      return { riskLevel: 'Bahaya', riskColor: '#DC2626' };
    default:
      return { riskLevel: 'Unknown', riskColor: '#6B7280' };
  }
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const onRefresh = useCallback(() => {
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const rainRes = await fetch(`${API_BASE}/api/rain`);
        const rainJson = await rainRes.json();
        const d = rainJson.data;
        const { riskLevel, riskColor } = mapAlertLevel(d.alert_level);

        const nodeRes = await fetch(`${API_BASE}/api/node/status`);
        const nodeJson = await nodeRes.json();
        const nodeStatus = nodeJson?.status === true;

        setData({
          nodeStatus,
          waterLevel: d.water_level,
          rainIntensity: d.rain_status,
          rainDuration: d.rain_duration_minutes,
          riskLevel,
          riskColor,
        });
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Initial fetch error:', err);
        setData({
          nodeStatus: false,
          waterLevel: 0,
          rainIntensity: 0,
          rainDuration: 0,
          riskLevel: 'Error',
          riskColor: '#DC2626',
        });
      }
    };

    fetchInitialData();

    const rainEvent = new EventSource(`${API_BASE}/api/rain`, {
      lineEndingCharacter: '\n',
    });
    const nodeEvent = new EventSource(`${API_BASE}/api/node/status`, {
      lineEndingCharacter: '\n',
    });

    const handleRainMessage = (event: any) => {
      try {
        const d = JSON.parse(event.data);
        const { riskLevel, riskColor } = mapAlertLevel(d.alert_level);

        setData((prev) => ({
          ...prev,
          waterLevel: d.water_level,
          rainIntensity: d.rain_status,
          rainDuration: d.rain_duration_minutes,
          riskLevel,
          riskColor,
        }));
        setLastUpdate(new Date());
      } catch (err) {
        console.error('SSE rain parse error:', err);
      }
    };

    const handleNodeMessage = (event: any) => {
      try {
        const d = JSON.parse(event.data);
        setData((prev) => ({
          ...prev,
          nodeStatus: d.status === true,
        }));
      } catch (err) {
        console.error('SSE node parse error:', err);
      }
    };

    rainEvent.addEventListener('message', handleRainMessage);
    nodeEvent.addEventListener('message', handleNodeMessage);

    return () => {
      rainEvent.close();
      nodeEvent.close();
    };
  }, []);

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header lastUpdate={lastUpdate} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Overview</Text>
          <View style={styles.cardRow}>
            <StatusCard
              title="Node Status"
              status={data.nodeStatus ? 'Online' : 'Offline'}
              color={data.nodeStatus ? '#10B981' : '#DC2626'}
              isOnline={data.nodeStatus}
            />
            <FloodRiskCard riskLevel={data.riskLevel} color={data.riskColor} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Monitoring</Text>
          <WaterLevelCard waterLevel={data.waterLevel} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Information</Text>
          <RainStatusCard
            rainStatus={RAIN_STATUS_TEXT[data.rainIntensity]}
            rainDuration={data.rainDuration}
            intensity={data.rainIntensity}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Assessment</Text>
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>Current Risk Level</Text>
            <Text style={[styles.riskLevel, { color: data.riskColor }]}>
              {data.riskLevel}
            </Text>
            <Text style={styles.riskDescription}>
              {data.riskLevel === 'Nihil' &&
                'Belum ada data terdeteksi dari sensor.'}
              {data.riskLevel === 'Error' &&
                'Terjadi kesalahan pada sistem atau sensor.'}
              {data.riskLevel === 'Aman' &&
                'Kondisi normal. Tidak ada ancaman banjir.'}
              {data.riskLevel === 'Waspada' &&
                'Perhatikan perkembangan. Siapkan antisipasi.'}
              {data.riskLevel.startsWith('Bahaya') &&
                'Ancaman banjir tinggi. Segera lakukan evakuasi!'}
            </Text>
          </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  riskCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  riskLevel: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  riskDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6B7280',
  },
});
