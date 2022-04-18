import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '../../../tailwind.config.js'

/**
 *  Extract the number portion from '1024px' or similar string
 */
const parseTailwindScreenValue = (w: string): number => parseInt(w.slice(0, w.indexOf('px')))

const fullConfig = resolveConfig(tailwindConfig)

const mobileW = parseTailwindScreenValue(fullConfig.theme.screens.sm)
const desktopW = parseTailwindScreenValue(fullConfig.theme.screens.xl)

export interface useResponsiveProps {
  isDesktop: boolean
  isTablet: boolean
  isMobile: boolean
}
export default function useResponsive (): useResponsiveProps {
  const [isClient, setIsClient] = useState(false)

  const isMobile = useMediaQuery({
    maxWidth: mobileW
  })

  const isTablet = useMediaQuery({
    minWidth: mobileW,
    maxWidth: desktopW - 1
  })

  const isDesktop = useMediaQuery({
    minWidth: desktopW
  })

  useEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true)
  }, [])

  return {
    isDesktop: isClient ? isDesktop : false,
    isTablet: isClient ? isTablet : false,
    isMobile: isClient ? isMobile : true
  }
}
