import React from 'react'

interface SpinnerProps {
  size?: number
  color?: string
}

const Spinner: React.FC<SpinnerProps> = ({ size = 10, color = '#f15f41' }) => (
  <div className='flex justify-center'>
    <svg
      className='animate-spin'
      data-testid='spinner-svg'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      width={size}
      height={size}
      style={{ color }}
    >
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  </div>
)

export default Spinner
