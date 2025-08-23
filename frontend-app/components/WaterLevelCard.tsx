import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplets } from 'lucide-react-native';

interface WaterLevelCardProps {
  waterLevel: number;
}

export function WaterLevelCard({ waterLevel }: WaterLevelCardProps) {
  const maxLevel = 100;
  const percentage = Math.min((waterLevel / maxLevel) * 100, 100);

  const getColor = (level: number) => {
    if (level <= 19) return '#10B981';
    if (level <= 50) return '#F59E0B';
    return '#DC2626';
  };

  const color = getColor(waterLevel);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Droplets size={24} color={color} />
          <Text style={styles.title}>Water Level</Text>
        </View>
        <Text style={[styles.value, { color }]}>{waterLevel} cm</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>

        <View style={styles.levelLabels}>
          <Text style={styles.levelLabel}>0</Text>
          <Text style={styles.levelLabel}>Safe (19)</Text>
          <Text style={styles.levelLabel}>Warning (50)</Text>
          <Text style={styles.levelLabel}>{maxLevel}</Text>
        </View>
      </View>

      <View style={styles.status}>
        <Text style={styles.statusText}>
          Status:{' '}
          <Text style={[styles.statusValue, { color }]}>
            {waterLevel <= 19
              ? 'Aman'
              : waterLevel <= 50
              ? 'Waspada'
              : 'Bahaya'}
          </Text>
        </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  status: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusValue: {
    fontWeight: '700',
  },
});
