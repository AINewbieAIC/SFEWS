import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

interface HeaderProps {
  lastUpdate: Date;
}

export function Header({ lastUpdate }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SFEWS</Text>
        <Text style={styles.subtitle}>Smart Flood Early Warning System</Text>
      </View>

      <View style={styles.updateContainer}>
        <RefreshCw size={16} color="#6B7280" />
        <Text style={styles.updateText}>
          Last update: {formatTime(lastUpdate)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#DAFFDF',
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomColor: 'transparent',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  updateText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
