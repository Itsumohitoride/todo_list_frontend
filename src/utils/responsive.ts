import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
};

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const getDeviceType = (width: number): DeviceType => {
  if (width >= BREAKPOINTS.desktop) {
    return 'desktop';
  } else if (width >= BREAKPOINTS.tablet) {
    return 'tablet';
  }
  return 'mobile';
};

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const deviceType = getDeviceType(dimensions.width);

  return {
    width: dimensions.width,
    height: dimensions.height,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isWeb: Platform.OS === 'web',
  };
};

export const getResponsiveValue = <T,>(
  mobileValue: T,
  tabletValue: T,
  desktopValue: T,
  deviceType: DeviceType
): T => {
  switch (deviceType) {
    case 'desktop':
      return desktopValue;
    case 'tablet':
      return tabletValue;
    default:
      return mobileValue;
  }
};
