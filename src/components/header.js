import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import MobileTabletAppBar from './MobileAppBar'
import DesktopAppBar from './DesktopAppBar'
import useResponsive from '../js/hooks/useResponsive'

export default function Header () {
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

  const handleClose = () => {
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

/**
 * Important:
 * This value defines the actual height of the header.
 * Map div uses absolute positioning and relies on the value to set
 * its top-${NAV_BAR_OFFSET}px
 * Todo: caclculate this value programmatically
 */
export const NAV_BAR_OFFSET = 112 // px
