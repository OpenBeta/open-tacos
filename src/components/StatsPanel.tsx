import React, { useEffect, useState } from 'react'
import Counter from './ui/Counter'
import BrainIcon from '../assets/icons/brain.svg'
import PinIcon from '../assets/icons/droppin.svg'

export interface StatsPanelProps {
  totalClimbs: number
  totalCrags: number
}

const StatsPanel = ({ totalClimbs, totalCrags }: StatsPanelProps): JSX.Element => {
  const delta = 50
  const [climb, setClimbCounter] = useState(totalClimbs - delta)
  const [crag, setCragCounter] = useState(totalCrags - delta)

  const timer = undefined
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

  return (
    <div className='lg:gap-y-8 flex flex-col md:flex-row md:gap-x-16 bg-gray-800 px-16 bg-opacity-80 rounded-lg border-b-4 border-b-gray-800'>
      <Counter icon={<BrainIcon className='w-8 h-8 stroke-white stroke-1' />} counter={climb} label='Climbs' />
      <Counter icon={<PinIcon className='w-8 h-8 stroke-white stroke-1' />} counter={crag} label='Crags' />
    </div>
  )
}

export default StatsPanel
