import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlertCardProps {
  time: string;
  date: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  read: boolean;
}

export function AlertCard({
  time,
  date,
  title,
  message,
  type,
  read,
}: AlertCardProps) {
  const getTypeColor = (alertType: string) => {
    switch (alertType) {
      case 'danger':
        return '#DC2626';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      case 'success':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const typeColor = getTypeColor(type);

  return (
    <View style={[styles.container, { opacity: read ? 0.7 : 1 }]}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {!read && <View style={styles.unreadDot} />}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={[styles.indicator, { backgroundColor: typeColor }]} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 4,
    height: '100%',
  },
});
