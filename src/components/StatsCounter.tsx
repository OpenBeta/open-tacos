import React, { useEffect, useState } from 'react'
import Counter from './ui/Counter'
import BrainIcon from '../assets/icons/brain.svg'
import PinIcon from '../assets/icons/droppin.svg'

export interface StatsCounterProps {
  totalClimbs: number
  totalCrags: number
}

const StatsCounter = ({ totalClimbs, totalCrags }: StatsCounterProps): JSX.Element => {
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
    <div className='gap-y-8 flex flex-col md:flex-row md:gap-x-16 bg-gray-800 rounded-md px-16'>
      <Counter icon={<BrainIcon className='w-8 h-8 stroke-white stroke-1' />} counter={climb} label='Climbs' />
      <Counter icon={<PinIcon className='w-8 h-8 stroke-white stroke-1' />} counter={crag} label='Crags' />
    </div>
  )
}

export default StatsCounter
