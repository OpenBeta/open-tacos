import React from 'react'
export interface CounterProps {
  icon: JSX.Element | null
  counter: number
  label: string
}

const Counter = ({ icon = null, counter, label }: CounterProps): JSX.Element => {
  return (
    <div className='flex flex-col items-center justify-between lg:gap-y-2'>
      {icon !== null && <div className='py-2'>{icon}</div>}
      <h3 className='text-rose-400 text-2xl md:text-4xl'>{counter}</h3>
      <div className='text-secondary-contrast'>{label}</div>
    </div>
  )
}

export default Counter
