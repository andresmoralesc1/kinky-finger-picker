import { useEffect, useState } from 'react';
import { AccessibilityService } from '../utils/accessibility';

/**
 * Hook to check accessibility features status
 */
export function useAccessibility() {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    // Initialize accessibility service
    AccessibilityService.init();

    // Check initial status
    setIsScreenReaderEnabled(AccessibilityService.isScreenReaderEnabled());

    // Note: AccessibilityService handles the listener internally
  }, []);

  return {
    isScreenReaderEnabled,
    announce: AccessibilityService.announce,
  };
}
