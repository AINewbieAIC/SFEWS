import { useState, useEffect, useRef, useCallback } from 'react';
import EventSource, { MessageEvent } from 'react-native-sse';
import { useConfig } from './useConfig';

interface DashboardData {
  nodeStatus: boolean;
  waterLevel: number;
  rainIntensity: number;
  rainDuration: number;
  riskLevel: string;
  riskColor: string;
}

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

export const useDashboard = () => {
  const config = useConfig();
  const [data, setData] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchInitialData = useCallback(async () => {
    try {
      setRefreshing(true);

      const rainRes = await fetch(`${config.apiBaseUrl}${config.rainEndpoint}`);
      const rainJson = await rainRes.json();
      const d = rainJson?.data;

      if (!d) {
        throw new Error('Invalid rain data');
      }

      const { riskLevel, riskColor } = mapAlertLevel(d.alert_level);

      const nodeRes = await fetch(
        `${config.apiBaseUrl}${config.nodeStatusEndpoint}`
      );
      const nodeJson = await nodeRes.json();
      const nodeStatus = nodeJson?.status === true;

      setData({
        nodeStatus,
        waterLevel: d.water_level ?? 0,
        rainIntensity: d.rain_status ?? 0,
        rainDuration: d.rain_duration_minutes ?? 0,
        riskLevel,
        riskColor,
      });
      setLastUpdate(new Date());
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      setData({
        nodeStatus: false,
        waterLevel: 0,
        rainIntensity: 0,
        rainDuration: 0,
        riskLevel: 'Error',
        riskColor: '#DC2626',
      });
    } finally {
      setRefreshing(false);
    }
  }, [config]);

  useEffect(() => {
    const isMounted = { current: true };

    fetchInitialData();

    const rainEvent = new EventSource(
      `${config.apiBaseUrl}${config.rainEndpoint}`,
      {
        lineEndingCharacter: '\n',
      }
    );

    const nodeEvent = new EventSource(
      `${config.apiBaseUrl}${config.nodeStatusEndpoint}`,
      {
        lineEndingCharacter: '\n',
      }
    );

    const handleRainMessage = (event: MessageEvent) => {
      if (!isMounted.current) return;

      try {
        const d = JSON.parse(event.data);
        if (!d) return;

        const { riskLevel, riskColor } = mapAlertLevel(d.alert_level);
        setData((prev) =>
          prev
            ? {
                ...prev,
                waterLevel: d.water_level ?? 0,
                rainIntensity: d.rain_status ?? 0,
                rainDuration: d.rain_duration_minutes ?? 0,
                riskLevel,
                riskColor,
              }
            : null
        );
        setLastUpdate(new Date());
      } catch (err) {
        console.error('❌ SSE rain parse error:', err);
      }
    };

    const handleNodeMessage = (event: MessageEvent) => {
      if (!isMounted.current) return;

      try {
        const d = JSON.parse(event.data);
        if (!d) return;

        setData((prev) =>
          prev
            ? {
                ...prev,
                nodeStatus: d.status === true,
              }
            : null
        );
      } catch (err) {
        console.error('❌ SSE node parse error:', err);
      }
    };

    rainEvent.addEventListener('message', handleRainMessage);
    nodeEvent.addEventListener('message', handleNodeMessage);

    return () => {
      isMounted.current = false;
      rainEvent.removeAllEventListeners?.();
      nodeEvent.removeAllEventListeners?.();
      rainEvent.close();
      nodeEvent.close();
    };
  }, [config, fetchInitialData]);

  return { data, refreshing, lastUpdate, onRefresh: fetchInitialData };
};
