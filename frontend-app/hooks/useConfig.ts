import Constants from 'expo-constants';

interface ConfigType {
  apiBaseUrl: string;
  rainEndpoint: string;
  rainAllEndpoint: string;
  nodeStatusEndpoint: string;
  eventsEndpoint: string;
}

export const useConfig = (): ConfigType => {
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL || 'http://103.250.10.113';
  const rainEndpoint = process.env.EXPO_PUBLIC_RAIN_ENDPOINT || '/api/rain';
  const rainAllEndpoint =
    process.env.EXPO_PUBLIC_RAIN_ALL_ENDPOINT || '/api/rain/all/5';
  const nodeStatusEndpoint =
    process.env.EXPO_PUBLIC_NODE_STATUS_ENDPOINT || '/api/node/status';
  const eventsEndpoint =
    process.env.EXPO_PUBLIC_EVENTS_ENDPOINT || '/api/events';

  return {
    apiBaseUrl,
    rainEndpoint,
    rainAllEndpoint,
    nodeStatusEndpoint,
    eventsEndpoint,
  };
};
