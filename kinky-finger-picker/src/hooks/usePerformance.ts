import { useCallback, useRef, useMemo } from 'react';
import { debounce, throttle, memoize, performanceMonitor } from '../utils/performance';

/**
 * Hook for performance optimization utilities
 */
export function usePerformance() {
  /**
   * Create a debounced callback
   */
  const useDebouncedCallback = useCallback(
    <T extends (...args: any[]) => any>(callback: T, delay: number) => {
      const debouncedRef = useRef(debounce(callback, delay));
      return debouncedRef.current;
    },
    []
  );

  /**
   * Create a throttled callback
   */
  const useThrottledCallback = useCallback(
    <T extends (...args: any[]) => any>(callback: T, limit: number) => {
      const throttledRef = useRef(throttle(callback, limit));
      return throttledRef.current;
    },
    []
  );

  /**
   * Create a memoized function
   */
  const useMemoizedFunction = useCallback(
    <T extends (...args: any[]) => any>(func: T) => {
      return useMemo(() => memoize(func), [func]);
    },
    []
  );

  /**
   * Performance monitoring
   */
  const startMeasure = useCallback((label: string) => {
    performanceMonitor.mark(label);
  }, []);

  const endMeasure = useCallback((label: string, threshold?: number) => {
    performanceMonitor.logMeasure(label, threshold);
  }, []);

  return {
    useDebouncedCallback,
    useThrottledCallback,
    useMemoizedFunction,
    startMeasure,
    endMeasure,
  };
}
