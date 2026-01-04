import { useState, useEffect, useRef } from 'react';
import EventSource, { MessageEvent } from 'react-native-sse';
import { useConfig } from './useConfig';

interface EventItem {
  id: string | number;
  time: string;
  event: string;
  risk: string;
  color: string;
}

const riskMap: Record<number, { risk: string; color: string }> = {
  [-2]: { risk: 'Nihil', color: '#6B7280' },
  [-1]: { risk: 'Error', color: '#DC2626' },
  [0]: { risk: 'Aman', color: '#10B981' },
  [1]: { risk: 'Waspada', color: '#F59E0B' },
  [2]: { risk: 'Bahaya', color: '#DC2626' },
};

const generateHistoryData = () => {
  const hours: string[] = [];
  const waterLevels: number[] = [];
  const rainData: number[] = [];

  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hours.push(hour.getHours().toString().padStart(2, '0'));
    waterLevels.push(Math.floor(Math.random() * 200) + 50);
    rainData.push(Number((Math.random() * 10).toFixed(1)));
  }

  return { hours, waterLevels, rainData };
};

export const useHistory = () => {
  const config = useConfig();
  const [historyData] = useState(generateHistoryData());
  const [events, setEvents] = useState<EventItem[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      const es = new EventSource(
        `${config.apiBaseUrl}${config.rainAllEndpoint}`,
        { lineEndingCharacter: '\n' }
      );

      eventSourceRef.current = es;

      es.addEventListener('message', (event: MessageEvent) => {
        if (!isMounted) return;

        try {
          const json = JSON.parse(event.data ?? '{}');

          if (json?.status && Array.isArray(json?.data)) {
            const mapped: EventItem[] = json.data.map(
              (item: any, idx: number) => {
                const level = item?.alert_level ?? 0;
                const { risk, color } = riskMap[level] || riskMap[0];
                return {
                  id: item?.id ?? `${Date.now()}-${idx}`,
                  time: new Date(item?.CreatedAt ?? Date.now()).toLocaleString(
                    'id-ID',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  ),
                  event: `Water Level: ${item?.water_level ?? '-'} cm, Rain: ${
                    item?.rain_status ?? '-'
                  }`,
                  risk,
                  color,
                };
              }
            );
            setEvents(mapped);
          }
        } catch (err) {
          console.error('❌ SSE JSON parse error:', err);
        }
      });

      es.addEventListener('error', (e) => {
        console.error('❌ SSE Error:', e?.message || e);
      });
    } catch (err) {
      console.error('❌ Failed to init SSE:', err);
    }

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [config]);

  const handleClose = (id: string | number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return { historyData, events, handleClose };
};
