import { getDeviceType, getResponsiveValue } from '../responsive';

describe('responsive utilities', () => {
  describe('getDeviceType', () => {
    it('should return mobile for width < 768', () => {
      expect(getDeviceType(320)).toBe('mobile');
      expect(getDeviceType(767)).toBe('mobile');
    });

    it('should return tablet for width >= 768 and < 1024', () => {
      expect(getDeviceType(768)).toBe('tablet');
      expect(getDeviceType(900)).toBe('tablet');
      expect(getDeviceType(1023)).toBe('tablet');
    });

    it('should return desktop for width >= 1024', () => {
      expect(getDeviceType(1024)).toBe('desktop');
      expect(getDeviceType(1440)).toBe('desktop');
      expect(getDeviceType(1920)).toBe('desktop');
    });
  });

  describe('getResponsiveValue', () => {
    it('should return mobile value for mobile device', () => {
      const result = getResponsiveValue('mobile', 'tablet', 'desktop', 'mobile');
      expect(result).toBe('mobile');
    });

    it('should return tablet value for tablet device', () => {
      const result = getResponsiveValue('mobile', 'tablet', 'desktop', 'tablet');
      expect(result).toBe('tablet');
    });

    it('should return desktop value for desktop device', () => {
      const result = getResponsiveValue('mobile', 'tablet', 'desktop', 'desktop');
      expect(result).toBe('desktop');
    });

    it('should work with different value types', () => {
      const numResult = getResponsiveValue(10, 20, 30, 'tablet');
      expect(numResult).toBe(20);

      const boolResult = getResponsiveValue(true, false, true, 'desktop');
      expect(boolResult).toBe(true);
    });
  });
});
