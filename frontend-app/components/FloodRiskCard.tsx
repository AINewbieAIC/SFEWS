import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Shield,
  TriangleAlert as AlertTriangle,
  OctagonAlert as AlertOctagon,
} from 'lucide-react-native';

interface FloodRiskCardProps {
  riskLevel: string;
  color: string;
}

export function FloodRiskCard({ riskLevel, color }: FloodRiskCardProps) {
  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Aman':
        return <Shield size={24} color={color} />;
      case 'Waspada':
        return <AlertTriangle size={24} color={color} />;
      case 'Bahaya':
        return <AlertOctagon size={24} color={color} />;
      default:
        return <Shield size={24} color={color} />;
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Text style={styles.title}>Flood Risk</Text>
      <View style={styles.riskContainer}>
        {getRiskIcon(riskLevel)}
        <Text style={[styles.risk, { color }]}>{riskLevel}</Text>
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
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  risk: {
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
