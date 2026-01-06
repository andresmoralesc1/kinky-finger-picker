/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit how often a function is called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to ensure it's called at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoization for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function memoized(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);

    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  };
}

/**
 * Lazy load component/module
 */
export function lazy<T>(
  loader: () => Promise<T>,
  fallback?: T
): { value: T | null; load: () => Promise<T> } {
  let cached: T | null = fallback || null;
  let loading = false;

  return {
    get value() {
      return cached;
    },
    async load() {
      if (cached && !fallback) return cached;
      if (loading) return cached!;

      loading = true;
      cached = await loader();
      loading = false;
      return cached;
    },
  };
}

/**
 * Image optimization utilities
 */
export const ImageOptimization = {
  /**
   * Get optimized image URI based on device capabilities
   */
  getOptimizedImageUri(
    baseUri: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpg' | 'png';
    }
  ): string {
    // For production, integrate with image CDN (Cloudinary, imgix, etc)
    // This is a placeholder implementation
    return baseUri;
  },

  /**
   * Preload image
   */
  async preload(uri: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = uri;
    });
  },

  /**
   * Get placeholder for progressive loading
   */
  getPlaceholder(width: number, height: number, color: string = '#1a1a1a'): string {
    // Return a tiny data URI placeholder
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(
      color
    )}'/%3E%3C/svg%3E`;
  },
};

/**
 * Animation performance helpers
 */
export const AnimationOptimization = {
  /**
   * Request animation frame with fallback
   */
  requestFrame(callback: () => void): number {
    if (typeof requestAnimationFrame !== 'undefined') {
      return requestAnimationFrame(callback);
    }
    return setTimeout(callback, 16) as unknown as number;
  },

  /**
   * Cancel animation frame
   */
  cancelFrame(id: number): void {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  },

  /**
   * Reduce motion check (respects user preference)
   */
  shouldReduceMotion(): boolean {
    // In React Native, you'd use AccessibilityInfo.isReduceMotionEnabled()
    // This is a placeholder
    return false;
  },
};

/**
 * List rendering optimization
 */
export const ListOptimization = {
  /**
   * Get optimal item height for FlatList
   */
  getItemLayout: (itemHeight: number) => (data: any, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  }),

  /**
   * Get optimal windowSize for FlatList
   */
  getWindowSize(listLength: number): number {
    if (listLength < 50) return 21;
    if (listLength < 100) return 11;
    return 7;
  },

  /**
   * Calculate maxToRenderPerBatch
   */
  getMaxToRenderPerBatch(itemsCount: number): number {
    if (itemsCount < 20) return 10;
    if (itemsCount < 100) return 5;
    return 3;
  },
};

/**
 * Memory optimization
 */
export const MemoryOptimization = {
  /**
   * Clear object references to help GC
   */
  clearObject<T extends Record<string, any>>(obj: T): void {
    Object.keys(obj).forEach((key) => {
      delete obj[key];
    });
  },

  /**
   * Create weak reference (for large objects)
   */
  weakRef<T extends object>(value: T): WeakRef<T> | T {
    if (typeof WeakRef !== 'undefined') {
      return new WeakRef(value);
    }
    // Fallback for environments without WeakRef
    return value;
  },
};

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  /**
   * Mark start of operation
   */
  mark(label: string): void {
    this.marks.set(label, Date.now());
  }

  /**
   * Measure time since mark
   */
  measure(label: string): number {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`No mark found for: ${label}`);
      return 0;
    }

    const duration = Date.now() - start;
    this.marks.delete(label);
    return duration;
  }

  /**
   * Log measure with threshold warning
   */
  logMeasure(label: string, threshold: number = 100): void {
    const duration = this.measure(label);
    if (duration > threshold) {
      console.warn(`⚠️ ${label} took ${duration}ms (threshold: ${threshold}ms)`);
    } else {
      console.log(`✅ ${label} took ${duration}ms`);
    }
  }

  /**
   * Clear all marks
   */
  clear(): void {
    this.marks.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();
