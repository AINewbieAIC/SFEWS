import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';

interface StatusCardProps {
  title: string;
  status: string;
  color: string;
  isOnline: boolean;
}

export function StatusCard({ title, status, color, isOnline }: StatusCardProps) {
  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.statusContainer}>
        {isOnline ? (
          <Wifi size={24} color={color} />
        ) : (
          <WifiOff size={24} color={color} />
        )}
        <Text style={[styles.status, { color }]}>{status}</Text>
      </View>
      
      <View style={[styles.indicator, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
  },
});