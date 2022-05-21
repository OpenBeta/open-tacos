import React from 'react'

interface CardProps {
  children: React.ReactNode
  footer?: JSX.Element
}

export default function Card ({ children, footer }: CardProps): JSX.Element {
  return (
    <div
      className='card rounded-lg cursor-pointer hover:bg-ob-secondary hover:bg-opacity-50 border'
    >
      <div className='m-5'>
        {children}
      </div>
      {footer}
    </div>
  )
}
