import React from 'react'
export interface CounterProps {
  icon: JSX.Element
  counter: number
  label: string
}

const Counter = ({ icon, counter, label }: CounterProps): JSX.Element => {
  return (
    <div className='flex flex-col items-center p-6'>
      <div>{icon}</div>
      <div>
        <h3 className='text-rose-400 pt-4 text-4xl'>{counter}</h3>
      </div>
      <div className='text-custom-green'>{label}</div>
    </div>
  )
}

export default Counter
