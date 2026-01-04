# Best Practices - Custom Hooks Architecture

## For Future Development

### Adding New Data-Fetching Components

When creating new tabs or components that need data:

```tsx
// 1. Create a new hook (e.g., hooks/useNewFeature.ts)
import { useConfig } from './useConfig';

export const useNewFeature = () => {
  const config = useConfig();
  const [data, setData] = useState(null);

  // Use config.apiBaseUrl for your endpoint
  const url = `${config.apiBaseUrl}/api/your-endpoint`;

  return { data };
};

// 2. Use in your component
import { useNewFeature } from '@/hooks';

export default function NewFeatureTab() {
  const { data } = useNewFeature();

  return (
    // Your UI here
  );
}
```

### Configuration Pattern

Always use `useConfig()` for API URLs:

```tsx
// ✅ CORRECT
const config = useConfig();
const url = `${config.apiBaseUrl}${config.rainEndpoint}`;

// ❌ WRONG - Hardcoding
const url = 'http://103.250.10.113/api/rain';
```

### Error Handling Pattern

Follow this pattern for consistent error handling:

```tsx
try {
  const response = await fetch(url);
  const data = await response.json();

  if (!data) {
    throw new Error('Invalid data');
  }

  setData(data);
} catch (err) {
  console.error('❌ Error description:', err);
  // Set error state or fallback data
}
```

### SSE Cleanup Pattern

Always clean up EventSource connections:

```tsx
useEffect(() => {
  let isMounted = true;

  const es = new EventSource(url);

  const handler = (event: MessageEvent) => {
    if (!isMounted) return; // Prevent stale updates
    // Handle event
  };

  es.addEventListener('message', handler);

  return () => {
    isMounted = false;
    es.close();
  };
}, []);
```

### State Management

Keep hook state focused and simple:

```tsx
// Good - Single responsibility
export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  return { data, refreshing };
};

// Avoid - Too many concerns
export const useEverything = () => {
  const [dashboard, setDashboard] = useState();
  const [alerts, setAlerts] = useState();
  const [history, setHistory] = useState();
  // ... too much
};
```

## TypeScript Interfaces

Define clear interfaces for all data:

```tsx
interface DashboardData {
  nodeStatus: boolean;
  waterLevel: number;
  rainIntensity: number;
  riskLevel: string;
  riskColor: string;
}

export const useDashboard = (): DashboardData => {
  // Implementation
};
```

## Environment Variables

For new endpoints, add to:

1. `.env` file:

   ```
   NEW_ENDPOINT=/api/new
   ```

2. `app.json` env sections:

   ```json
   "env": {
     "production": {
       "EXPO_PUBLIC_NEW_ENDPOINT": "/api/new"
     }
   }
   ```

3. `hooks/useConfig.ts`:
   ```tsx
   export const useConfig = (): ConfigType => {
     const newEndpoint = process.env.EXPO_PUBLIC_NEW_ENDPOINT || '/api/new';
     // ...
   };
   ```

## Common Pitfalls to Avoid

### ❌ Creating state in render

```tsx
// Bad
export default function MyComponent() {
  const [data] = useState(fetchData()); // Runs every render!
}
```

### ✅ Use useEffect

```tsx
// Good
export default function MyComponent() {
  const { data } = useNewHook(); // Hook manages state
}
```

### ❌ Forgetting cleanup

```tsx
// Bad
useEffect(() => {
  const es = new EventSource(url);
  // No cleanup!
}, []);
```

### ✅ Always cleanup

```tsx
// Good
useEffect(() => {
  const es = new EventSource(url);
  return () => es.close();
}, []);
```

### ❌ Hardcoding API URLs

```tsx
// Bad
const response = await fetch('http://103.250.10.113/api/rain');
```

### ✅ Use useConfig

```tsx
// Good
const config = useConfig();
const response = await fetch(`${config.apiBaseUrl}${config.rainEndpoint}`);
```

## Performance Optimization

### Memoization

For complex components that depend on data:

```tsx
import { useMemo } from 'react';

export default function MyComponent({ data }) {
  const processedData = useMemo(() => {
    return data?.map(transform);
  }, [data]);

  return <View>{processedData}</View>;
}
```

### Callback Memoization

For event handlers passed to children:

```tsx
import { useCallback } from 'react';

const handleRefresh = useCallback(() => {
  fetchInitialData();
}, [fetchInitialData]);
```

## Testing Your Hooks

Create `.test.ts` files:

```tsx
// hooks/useNewFeature.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { useNewFeature } from './useNewFeature';

test('loads data', async () => {
  const { result } = renderHook(() => useNewFeature());

  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });
});
```

## Debugging Tips

1. **Enable Debug Logging**

   ```tsx
   console.log('📡 Connecting to:', url);
   console.log('✅ Data received:', data);
   console.error('❌ Error occurred:', error);
   ```

2. **Check Network Tab**

   - Monitor SSE connections
   - Verify endpoint URLs
   - Check response data

3. **React DevTools**

   - Inspect hook state
   - Check re-renders
   - Monitor performance

4. **Expo CLI**
   - Use `expo logs` for real-time logs
   - Enable remote debugging
   - Check for warnings

## Code Review Checklist

Before committing changes:

- [ ] Hook has single responsibility
- [ ] All API URLs use useConfig
- [ ] Error handling implemented
- [ ] Cleanup functions in useEffect
- [ ] Types properly defined
- [ ] No hardcoded values
- [ ] No console errors
- [ ] Component styling unchanged
- [ ] isMounted refs used for SSE
- [ ] Environment variables added to .env

---

For questions or issues, refer to the existing hooks as examples!
