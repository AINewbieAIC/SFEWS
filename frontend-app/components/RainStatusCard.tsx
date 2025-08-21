import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CloudRain, Sun, Cloud } from 'lucide-react-native';

interface RainStatusCardProps {
  rainStatus: string;
  rainDuration: number;
  intensity: number;
}

export function RainStatusCard({ rainStatus, rainDuration, intensity }: RainStatusCardProps) {
  const getRainIcon = (level: number) => {
    switch (level) {
      case 0: return <Sun size={32} color="#F59E0B" />;
      case 1: return <Cloud size={32} color="#6B7280" />;
      case 2: return <CloudRain size={32} color="#3B82F6" />;
      case 3: return <CloudRain size={32} color="#1E40AF" />;
      default: return <Sun size={32} color="#F59E0B" />;
    }
  };

  const getRainColor = (level: number) => {
    switch (level) {
      case 0: return '#F59E0B';
      case 1: return '#6B7280';
      case 2: return '#3B82F6';
      case 3: return '#1E40AF';
      default: return '#F59E0B';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return 'Tidak ada';
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}j ${remainingMinutes}m`;
  };

  const rainColor = getRainColor(intensity);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {getRainIcon(intensity)}
        <View style={styles.headerText}>
          <Text style={styles.title}>Rain Status</Text>
          <Text style={[styles.status, { color: rainColor }]}>{rainStatus}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Durasi Hujan</Text>
          <Text style={styles.detailValue}>{formatDuration(rainDuration)}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Intensitas</Text>
          <View style={styles.intensityContainer}>
            {[1, 2, 3, 4].map((level) => (
              <View
                key={level}
                style={[
                  styles.intensityBar,
                  {
                    backgroundColor: level <= intensity ? rainColor : '#E5E7EB',
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  status: {
    fontSize: 18,
    fontWeight: '700',
  },
  details: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  intensityContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  intensityBar: {
    width: 8,
    height: 16,
    borderRadius: 4,
  },
});