import React from 'react'
import clx from 'classnames'

export interface CardProps {
  image: JSX.Element
  header?: string | JSX.Element
  imageActions?: JSX.Element | undefined
  body: string | JSX.Element
  bordered?: boolean
}

export default function Card ({
  header,
  image,
  imageActions,
  body,
  bordered = false
}: CardProps): JSX.Element {
  return (
    <div className={clx('card card-compact bg-base-100', bordered ? 'border shadow-lg' : '')}>
      <div className={clx('flex items-center justify-between', bordered ? 'mx-2' : '')}>{header}</div>
      <figure className='overflow-hidden rounded sm:rounded-none sm:rounded-box'>
        {image}
      </figure>
      {imageActions}
      <div className={clx('card-body', bordered ? 'mx-4' : '')}>{body}</div>
    </div>
  )
}
