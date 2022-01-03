import React from 'react'

function Card ({ children, footer }: {children: JSX.Element | JSX.Element[], footer?: JSX.Element}): JSX.Element {
  return (
    <div
      className='card rounded-lg cursor-pointer hover:bg-yellow-50 border'
    >
      <div className='m-5'>
        {children}
      </div>
      {footer}
    </div>
  )
}

export default Card
