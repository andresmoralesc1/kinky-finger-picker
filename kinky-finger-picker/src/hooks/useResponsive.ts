import { useEffect, useState } from 'react';
import { ScaledSize } from 'react-native';
import { Responsive, DeviceType, Orientation } from '../utils/responsive';

/**
 * Hook to track responsive state changes
 */
export function useResponsive() {
  const [deviceType, setDeviceType] = useState<DeviceType>(Responsive.getDeviceType());
  const [orientation, setOrientation] = useState<Orientation>(Responsive.getOrientation());
  const [dimensions, setDimensions] = useState(Responsive.getDimensions());

  useEffect(() => {
    const unsubscribe = Responsive.init((newDimensions: ScaledSize) => {
      setDeviceType(Responsive.getDeviceType());
      setOrientation(Responsive.getOrientation());
      setDimensions({ width: newDimensions.width, height: newDimensions.height });
    });

    return unsubscribe;
  }, []);

  return {
    deviceType,
    orientation,
    dimensions,
    isTablet: deviceType === 'tablet' || deviceType === 'desktop',
    isPhone: deviceType === 'phone',
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    wp: Responsive.wp,
    hp: Responsive.hp,
    fontSize: Responsive.fontSize,
  };
}
