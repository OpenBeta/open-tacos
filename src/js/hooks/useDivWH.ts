import { useEffect, useCallback, useState } from 'react'

const DEFAULT_WH = {
  width: 400,
  height: 400
}
/**
 * React hook for auto detecting and calculating div height
 */
export default function useDivDimensions ({ divId }): any {
  const [{ width, height }, setWH] = useState(DEFAULT_WH)

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const updateDimensions = useCallback(() => {
    const { width, height } = getDivWH(divId, 0)
    setWH({ width, height })
  }, [width, height])

  return { width, height }
}

const getDivWH = (id: string, offset: number): { width: number, height: number } => {
  const div = document.getElementById(id)
  console.log('#div', div)
  if (div != null) {
    return { width: div.clientWidth, height: div.clientHeight }
  }
  return DEFAULT_WH
}
