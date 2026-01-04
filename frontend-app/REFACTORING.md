# Code Refactoring Documentation

## Overview

The codebase has been refactored to improve maintainability, reduce code duplication, and separate concerns by moving data fetching logic to custom hooks.

## Key Changes

### 1. **Environment Configuration**

- Created `.env` file with centralized API configuration
- Environment variables are loaded through `useConfig` hook
- Updated `app.json` with environment settings for production and development

### 2. **Custom Hooks**

All data fetching and state management logic has been extracted into custom hooks:

#### `useConfig.ts`

- Centralized configuration management
- Exports API base URL and all endpoints
- Supports environment variable overrides

#### `useDashboard.ts`

- Handles dashboard data fetching from Rain and Node Status endpoints
- Manages SSE (Server-Sent Events) connections for real-time updates
- Provides: `data`, `refreshing`, `lastUpdate`, `onRefresh`
- Features: Automatic error handling, null safety checks

#### `useAlerts.ts`

- Manages alert notifications via SSE
- Handles connection status tracking
- Automatic reconnection on failure (5s intervals)
- Provides: `alerts`, `connectionStatus`, `handleCloseAlert`
- Respects user notification preferences (push, SMS, warning, danger)

#### `useHistory.ts`

- Fetches historical event data from the Rain endpoint
- Generates mock data for 24-hour water level and rainfall trends
- Provides: `historyData`, `events`, `handleClose`

### 3. **Tab Components Refactoring**

#### `index.tsx` (Dashboard)

- **Before**: 153+ lines with mixed concerns
- **After**: 70 lines, uses `useDashboard` hook
- Styling and UI logic preserved completely
- Cleaner component with better separation of concerns

#### `alerts.tsx` (Alerts)

- **Before**: 328 lines with complex SSE logic
- **After**: 120 lines, uses `useAlerts` hook
- Connection status management simplified
- Alert notification flow improved
- Push notification integration at component level

#### `history.tsx` (History)

- **Before**: 227 lines with SSE initialization
- **After**: 130 lines, uses `useHistory` hook
- Data generation and fetching logic centralized
- UI remains unchanged

## File Structure

```
hooks/
├── index.ts           # Barrel export
├── useConfig.ts       # Configuration management
├── useDashboard.ts    # Dashboard data logic
├── useAlerts.ts       # Alerts management
├── useHistory.ts      # History data logic
└── useFrameworkReady.ts # (existing)

.env                   # Environment variables
.env.example           # Example configuration
app.json              # Updated with env config
```

## Benefits

✅ **Reduced Code Duplication**: Common fetching patterns extracted into hooks  
✅ **Better Maintainability**: Logic separated from UI components  
✅ **Easier Testing**: Pure hooks easier to unit test  
✅ **Centralized Configuration**: Single source of truth for API URLs  
✅ **Improved Error Handling**: Consistent error patterns across hooks  
✅ **Type Safety**: Proper TypeScript interfaces maintained  
✅ **No Breaking Changes**: Styling and content completely preserved

## Migration Guide

### For New Components

Import hooks from the hooks folder:

```tsx
import { useDashboard, useAlerts, useHistory } from '@/hooks';

export default function MyComponent() {
  const { data, refreshing } = useDashboard();
  // Use the data...
}
```

### Environment Variables

To change API endpoints:

1. Edit `.env` file
2. Or update `app.json` env section for different environments
3. Or set environment variables at build time (for CI/CD)

## Potential Force Close Fixes

The refactoring addresses common force close issues:

1. **Null Safety**: All data accesses include null checks before rendering
2. **Resource Cleanup**: Proper cleanup of EventSource connections in useEffect return
3. **Memory Leaks**: isMounted refs prevent state updates on unmounted components
4. **Error Handling**: Try-catch blocks with proper error logging
5. **Type Safety**: Interfaces prevent undefined property access

## Testing the Build

```bash
# Development
npm run dev

# Android
npm run android

# iOS
npm run ios

# Web
npm run build:web
```

Verify no console errors and all tabs load correctly with data from the API.
