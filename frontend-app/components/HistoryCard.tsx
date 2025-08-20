import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

interface HistoryCardProps {
  time: string;
  event: string;
  risk: string;
  color: string;
}

export function HistoryCard({ time, event, risk, color }: HistoryCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Clock size={16} color="#6B7280" />
        <Text style={styles.time}>{time}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.event}>{event}</Text>
        <View style={[styles.riskBadge, { backgroundColor: color }]}>
          <Text style={styles.riskText}>{risk}</Text>
        </View>
      </View>
      
      <View style={[styles.indicator, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  event: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 4,
    height: '100%',
  },
});