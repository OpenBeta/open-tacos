import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import MobileTabletAppBar from './MobileAppBar'
import DesktopAppBar from './DesktopAppBar'
import useResponsive from '../js/hooks/useResponsive'

const NAV_BAR_IDENTIFIER = 'tacos-nav-bar'

interface HeaderProps {
  showFilterBar?: boolean
}

export default function Header (props: HeaderProps): JSX.Element {
  const { isTablet, isMobile } = useResponsive()
  const includeFilters = Boolean(props.showFilterBar)

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
    <div id={NAV_BAR_IDENTIFIER} className='relative z-40'>
      {isTablet || isMobile
        ? <MobileTabletAppBar includeFilters={includeFilters} />
        : <DesktopAppBar
            expanded={expanded}
            onExpandSearchBox={() => {
              setExpanded(true)
            }}
            onClose={handleClose}
            showFilterBar={includeFilters}
          />}
    </div>
  )
}

export const getNavBarOffset = (): number => {
  if (typeof document === 'undefined') {
    return 0
  }

  return document.getElementById(NAV_BAR_IDENTIFIER)?.offsetHeight ?? 0
}
