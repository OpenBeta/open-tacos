import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import MobileTabletAppBar from './MobileAppBar'
import DesktopAppBar from './DesktopAppBar'
import useResponsive, { useResponsiveProps } from '../js/hooks/useResponsive'

export default function Header (): JSX.Element {
  const { isTablet, isMobile } = useResponsive()

  const router = useRouter()
  const isIndexPage = router.pathname === '/'

  // track expand/collapse of search widget (for large screen only)
  const [expanded, setExpanded] = useState(isIndexPage)

  const controlDirection = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.scrollY < 150 && isIndexPage) {
      setExpanded(true)
    }
    if (typeof window !== 'undefined' && window.scrollY > 150) {
      setExpanded(false)
    }
  }, [isIndexPage])

  useEffect(() => {
    window.addEventListener('scroll', controlDirection)
    return () => {
      window.removeEventListener('scroll', controlDirection)
    }
  }, [])

  const handleClose = (): void => {
    if ((typeof window !== 'undefined' && window.scrollY > 150) || !isIndexPage) {
      setExpanded(false)
    }
  }

  return (
    <>
      {isTablet || isMobile
        ? <MobileTabletAppBar />
        : <DesktopAppBar
            expanded={expanded}
            onExpandSearchBox={() => {
              setExpanded(true)
            }}
            onClose={handleClose}
          />}
    </>
  )
}

export const getNavBarOffset = ({ isTablet, isMobile, isDesktop = false }: useResponsiveProps): number => {
  if (isMobile) return NAV_BAR_OFFSET.mobile
  if (isTablet) return NAV_BAR_OFFSET.tablet
  return NAV_BAR_OFFSET.desktop
}

/**
 * Important:
 * This value defines the actual height of header + toolbar.
 * Map div container uses absolute positioning and relies on the value to set
 * its top-${NAV_BAR_OFFSET}px and height.
 * Todo: caclculate this value programmatically
 */
const NAV_BAR_OFFSET = {
  mobile: 96,
  tablet: 96,
  desktop: 112
}
