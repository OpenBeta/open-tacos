import React, { useEffect, useState } from 'react'
import Counter from './Counter'
import BrainIcon from '../../assets/icons/brain.svg'
import PinIcon from '../../assets/icons/droppin.svg'

export interface StatsPanelProps {
  totalClimbs: number
  totalCrags: number
  isMobile: boolean
  className?: string
}

const StatsPanel = ({ className = '', isMobile = true, totalClimbs, totalCrags }: StatsPanelProps): JSX.Element => {
  const delta = 50
  const [climb, setClimbCounter] = useState(totalClimbs - delta)
  const [crag, setCragCounter] = useState(totalCrags - delta)

  const timer = undefined
  if (!isMobile) {
    useEffect(() => {
      if (climb < totalClimbs) {
        setTimeout(() => {
          setClimbCounter(climb + 1)
          setCragCounter(crag + 1)
        }, 50)
      }

      return () => {
        clearTimeout(timer)
      }
    }, [climb, crag])
  }

  return (
    <div className={`flex flex-row gap-x-8 bg-gray-700 bg-opacity-70 rounded-lg border-b-4 border-b-gray-900 ${className}`}>
      <Counter icon={isMobile ? null : <BrainIcon className='w-8 h-8 stroke-white stroke-1' />} counter={climb} label='Climbs' />
      <Counter icon={isMobile ? null : <PinIcon className='w-8 h-8 stroke-white stroke-1' />} counter={crag} label='Crags' />
    </div>
  )
}

export default StatsPanel
