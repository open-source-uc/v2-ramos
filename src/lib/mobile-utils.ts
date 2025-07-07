/**
 * Utility functions for mobile device detection and mobile-specific behavior
 */

/**
 * Detects if the current device is likely a mobile device
 * Uses a combination of screen width and user agent detection
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check screen width (tablet breakpoint is 768px according to the CSS)
  const isMobileWidth = window.innerWidth < 768;
  
  // Check user agent for mobile indicators
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Check if device has touch capabilities
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Return true if device has mobile width and either mobile user agent or touch capability
  return isMobileWidth && (isMobileUserAgent || isTouchDevice);
}

/**
 * Detects if the device is in mobile viewport (width-based only)
 * This is useful for responsive behavior that should trigger on narrow screens
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // tablet breakpoint
}