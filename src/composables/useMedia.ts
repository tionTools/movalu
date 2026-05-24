import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useMedia() {
  const bp = useBreakpoints(breakpointsTailwind)

  const isMobile = bp.smaller('md') // < 768
  const isTabletUp = bp.greaterOrEqual('md') // >= 768
  const isTabletOnly = bp.between('md', 'lg') // >= 768 && < 1024
  const isDesktop = bp.greaterOrEqual('lg') // >= 1024
  const isDesktopOnly = bp.between('lg', '2xl') // >= 1024 && < 1536
  const isLargeDesktop = bp.greaterOrEqual('2xl') // >= 1536

  const isSmallMobile = bp.smaller('sm') // < 640
  const isMobileOrTablet = bp.smaller('lg') // < 1024
  const isTabletOrDesktop = bp.greaterOrEqual('md') // >= 768
  const isLargeTabletUp = bp.greaterOrEqual('xl') // >= 1280

  return {
    isSmallMobile,
    isMobile,
    isTabletUp,
    isTabletOnly,
    isMobileOrTablet,
    isTabletOrDesktop,
    isDesktop,
    isDesktopOnly,
    isLargeTabletUp,
    isLargeDesktop,
  }
}
