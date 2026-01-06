# Performance Optimization Guide

This document details the performance optimizations implemented in Kinky Finger Picker.

## Overview

Performance optimizations focus on:
- **Render Performance** - Smooth 60fps animations
- **Memory Management** - Efficient resource usage
- **Load Time** - Fast app startup
- **Bundle Size** - Minimal download size

---

## Features Implemented

### 1. Debouncing & Throttling

**Debounce** - Delays function execution until after a pause in calls:

```tsx
import { debounce } from '../utils/performance';

// Search input - wait 300ms after user stops typing
const handleSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

<TextInput onChangeText={handleSearch} />
```

**Throttle** - Limits function execution to once per interval:

```tsx
import { throttle } from '../utils/performance';

// Scroll handler - execute at most once per 100ms
const handleScroll = throttle((event) => {
  updateScrollPosition(event);
}, 100);

<ScrollView onScroll={handleScroll} />
```

---

### 2. Memoization

Cache expensive computations:

```tsx
import { memoize } from '../utils/performance';

// Expensive calculation cached based on inputs
const calculateStats = memoize((players: Player[]) => {
  // Complex statistics calculation
  return computeComplexStats(players);
});

// First call: Computes and caches
const stats1 = calculateStats(players);

// Subsequent calls with same input: Returns cached result
const stats2 = calculateStats(players);
```

---

### 3. Lazy Loading

Load components/modules only when needed:

```tsx
import { lazy } from '../utils/performance';

// Lazy load heavy component
const AchievementsScreen = lazy(
  () => import('./screens/AchievementsScreen')
);

// Later, when needed:
const screen = await AchievementsScreen.load();
```

---

### 4. Image Optimization

**Progressive Loading:**

```tsx
import OptimizedImage from '../components/OptimizedImage';

<OptimizedImage
  source={{ uri: 'https://example.com/image.jpg' }}
  width={200}
  height={200}
  showLoader={true}
  placeholder="#1a1a1a"
  onLoadEnd={() => console.log('Loaded')}
/>
```

**Features:**
- Placeholder while loading
- Loading indicator
- Error fallback
- Automatic resizing

---

### 5. List Optimization

**FlatList Performance:**

```tsx
import { ListOptimization } from '../utils/performance';

<FlatList
  data={items}
  // Fixed item height for better performance
  getItemLayout={ListOptimization.getItemLayout(100)}

  // Optimal window size
  windowSize={ListOptimization.getWindowSize(items.length)}

  // Render items in batches
  maxToRenderPerBatch={ListOptimization.getMaxToRenderPerBatch(items.length)}

  // Remove clipped subviews (Android)
  removeClippedSubviews={true}

  // Key extractor
  keyExtractor={(item) => item.id}

  // Render item
  renderItem={({ item }) => <Item data={item} />}
/>
```

---

### 6. Performance Monitoring

Track performance of operations:

```tsx
import { performanceMonitor } from '../utils/performance';

function expensiveOperation() {
  // Start timing
  performanceMonitor.mark('operation');

  // ... do expensive work ...

  // End timing and log
  performanceMonitor.logMeasure('operation', 100); // Warns if > 100ms
}
```

**Hook Version:**

```tsx
import { usePerformance } from '../hooks/usePerformance';

function MyComponent() {
  const { startMeasure, endMeasure } = usePerformance();

  useEffect(() => {
    startMeasure('component-mount');

    return () => {
      endMeasure('component-mount', 50); // Warn if > 50ms
    };
  }, []);
}
```

---

### 7. Memory Management

**Clear References:**

```tsx
import { MemoryOptimization } from '../utils/performance';

// Clear object to help garbage collection
useEffect(() => {
  const largeData = loadLargeData();

  return () => {
    MemoryOptimization.clearObject(largeData);
  };
}, []);
```

---

## React Optimizations

### 1. useMemo

Memoize expensive calculations:

```tsx
const sortedPlayers = useMemo(() => {
  return players.sort((a, b) => b.score - a.score);
}, [players]); // Only recalculate when players change
```

### 2. useCallback

Memoize callbacks to prevent re-renders:

```tsx
const handlePress = useCallback(() => {
  selectPlayer(playerId);
}, [playerId]); // Only recreate when playerId changes
```

### 3. React.memo

Prevent unnecessary re-renders:

```tsx
const PlayerCard = React.memo(({ player }) => {
  return <View>{player.name}</View>;
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip render)
  return prevProps.player.id === nextProps.player.id;
});
```

---

## Animation Optimization

### 1. useNativeDriver

Use native thread for animations:

```tsx
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // ✅ Runs on native thread
}).start();
```

### 2. Reduce Motion

Respect user preference:

```tsx
import { AnimationOptimization } from '../utils/performance';

const shouldAnimate = !AnimationOptimization.shouldReduceMotion();

if (shouldAnimate) {
  startAnimation();
} else {
  // Show end state immediately
  setAnimatedValue(finalValue);
}
```

---

## Bundle Size Optimization

### 1. Tree Shaking

Import only what you need:

```tsx
// ❌ Bad - imports entire library
import _ from 'lodash';

// ✅ Good - imports only needed function
import debounce from 'lodash/debounce';
```

### 2. Code Splitting

Split code into chunks:

```tsx
// Lazy load screens
const AchievementsScreen = React.lazy(
  () => import('./screens/AchievementsScreen')
);
```

---

## Network Optimization

### 1. Request Debouncing

Prevent multiple rapid requests:

```tsx
const debouncedSave = debounce(async (data) => {
  await api.save(data);
}, 500);

// Called multiple times, but only saves once after 500ms pause
onChange={(value) => debouncedSave(value)}
```

### 2. Request Batching

Combine multiple requests:

```tsx
const batchRequests = (requests: Request[]) => {
  return Promise.all(requests.map(r => fetch(r)));
};
```

---

## Performance Checklist

### Before Release:

**Rendering:**
- [ ] Lists use `FlatList` with optimization props
- [ ] Heavy components use `React.memo`
- [ ] Callbacks use `useCallback`
- [ ] Calculations use `useMemo`
- [ ] Animations use `useNativeDriver`

**Images:**
- [ ] Images are optimized (compressed)
- [ ] Images use progressive loading
- [ ] Images have appropriate dimensions
- [ ] Placeholder images for loading states

**Bundle:**
- [ ] No unused dependencies
- [ ] Tree shaking enabled
- [ ] Code splitting implemented
- [ ] Bundle size analyzed

**Memory:**
- [ ] No memory leaks
- [ ] Event listeners cleaned up
- [ ] Timers cleared in useEffect cleanup
- [ ] Large objects properly disposed

**Network:**
- [ ] API calls debounced/throttled
- [ ] Requests batched when possible
- [ ] Error handling in place
- [ ] Loading states implemented

---

## Performance Targets

### Metrics

**App Startup:**
- Time to interactive: < 2s
- First meaningful paint: < 1s

**Animations:**
- Target FPS: 60fps
- No jank in scrolling

**Memory:**
- Memory usage: < 150MB on phone
- No memory leaks

**Bundle:**
- Bundle size: < 10MB
- JS bundle: < 2MB

---

## Performance Testing

### Tools

**React Native:**
```bash
# Enable performance monitor
npm start -- --reset-cache

# In app: Dev Menu → Show Perf Monitor
```

**Flipper:**
```bash
# Install Flipper Desktop
# Connect device
# View: Network, Layout, Hermes Debugger
```

**Profiling:**
```tsx
import { Profiler } from 'react';

<Profiler
  id="MyComponent"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} took ${actualDuration}ms`);
  }}
>
  <MyComponent />
</Profiler>
```

---

## Common Performance Issues

### Issue: List Scrolling Janky

**Solution:**
```tsx
// Add optimization props
<FlatList
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={21}
  getItemLayout={getItemLayout}
  initialNumToRender={10}
/>
```

### Issue: Component Re-rendering Too Often

**Solution:**
```tsx
// Wrap with React.memo
export default React.memo(MyComponent, (prev, next) => {
  return prev.data.id === next.data.id;
});
```

### Issue: Slow Animations

**Solution:**
```tsx
// Use native driver
Animated.timing(value, {
  useNativeDriver: true, // ✅
  toValue: 1,
}).start();
```

### Issue: Memory Increasing Over Time

**Solution:**
```tsx
useEffect(() => {
  const subscription = subscribe();

  return () => {
    subscription.unsubscribe(); // ✅ Cleanup
  };
}, []);
```

---

## Best Practices

### DO:
✅ Use FlatList for long lists
✅ Memoize expensive calculations
✅ Use useNativeDriver for animations
✅ Clean up subscriptions and timers
✅ Optimize images before including
✅ Monitor performance during development
✅ Profile before optimizing

### DON'T:
❌ Premature optimization
❌ Use inline functions in render
❌ Ignore console warnings
❌ Skip performance testing
❌ Load all data at once
❌ Forget to clean up effects
❌ Use synchronous operations on main thread

---

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Hermes Engine](https://hermesengine.dev/)
- [Flipper Debugger](https://fbflipper.com/)
- [React Profiler](https://reactjs.org/docs/profiler.html)
