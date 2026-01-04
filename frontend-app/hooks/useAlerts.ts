import { useEffect, useRef, useState, useCallback } from 'react';
import EventSource, { MessageEvent } from 'react-native-sse';
import { useConfig } from './useConfig';

interface AlertItem {
  id: string | number;
  time: string;
  date: string;
  title: string;
  message: string;
  type: AlertType;
}

type AlertType = 'danger' | 'warning' | 'info' | 'success';
type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

const addEmojiToTitle = (title: string, type: AlertType): string => {
  if (/^[🚨⚠️📡✅]/.test(title)) return title;
  switch (type) {
    case 'danger':
      return `🚨 ${title}`;
    case 'warning':
      return `⚠️ ${title}`;
    case 'info':
      return `📡 ${title}`;
    case 'success':
      return `✅ ${title}`;
    default:
      return title;
  }
};

export const useAlerts = (
  pushEnabled: boolean,
  warningEnabled: boolean,
  dangerEnabled: boolean
) => {
  const config = useConfig();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const initializeSSE = useCallback(() => {
    if (!isMounted.current) return;

    try {
      eventSourceRef.current?.close();
      setConnectionStatus('connecting');

      const eventSource = new EventSource(
        `${config.apiBaseUrl}${config.eventsEndpoint}`,
        {
          headers: {
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        }
      );

      eventSourceRef.current = eventSource;

      eventSource.addEventListener('open', () => {
        console.log('📡 SSE Connection opened');
        if (isMounted.current) setConnectionStatus('connected');
      });

      eventSource.addEventListener('notification', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data || '{}');
          if (!data?.type) return;

          const shouldShowAlert =
            (data.type === 'warning' && warningEnabled) ||
            (data.type === 'danger' && dangerEnabled) ||
            data.type === 'info' ||
            data.type === 'success';

          if (!shouldShowAlert) return;

          const newAlert: AlertItem = {
            id: data.id ?? Date.now(),
            time: data.time ?? new Date().toLocaleTimeString(),
            date: data.date ?? new Date().toLocaleDateString(),
            title: addEmojiToTitle(data.title ?? 'New Alert', data.type),
            message: data.message ?? '',
            type: data.type,
          };

          if (isMounted.current) {
            setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
            if (pushEnabled) {
              // Native Alert would be called from component
              console.log('🔔 Alert:', newAlert.title);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing notification data:', error);
        }
      });

      eventSource.addEventListener('error', (event: any) => {
        console.error('❌ SSE Error:', event);
        if (isMounted.current) setConnectionStatus('error');

        if (isMounted.current) {
          setAlerts((prev) => [
            {
              id: Date.now(),
              time: new Date().toLocaleTimeString(),
              date: new Date().toLocaleDateString(),
              title: addEmojiToTitle('SSE Connection Error', 'danger'),
              message: 'Failed to connect. Retrying...',
              type: 'danger',
            },
            ...prev,
          ]);
        }

        if (isMounted.current) {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            initializeSSE();
          }, 5000);
        }
      });

      eventSource.addEventListener('close', () => {
        console.log('📴 SSE Connection closed');
        if (isMounted.current) setConnectionStatus('disconnected');
      });
    } catch (error) {
      console.error('❌ Failed to initialize SSE:', error);
      if (isMounted.current) setConnectionStatus('error');
    }
  }, [config, pushEnabled, warningEnabled, dangerEnabled]);

  useEffect(() => {
    isMounted.current = true;
    initializeSSE();

    return () => {
      isMounted.current = false;
      eventSourceRef.current?.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [initializeSSE]);

  const handleCloseAlert = (id: string | number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return { alerts, connectionStatus, handleCloseAlert };
};
