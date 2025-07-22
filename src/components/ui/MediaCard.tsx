import React from 'react'
import clx from 'classnames'

export interface CardProps {
  image: JSX.Element
  header?: string | JSX.Element
  imageActions?: JSX.Element | undefined
  body: string | JSX.Element
  bordered?: boolean
}

export default function MediaCard ({
  header,
  image,
  imageActions,
  body,
  bordered = false
}: CardProps): JSX.Element {
  return (
    <div
      className={clx(
        'card card-compact bg-base-100',
        'w-72 h-[28rem] flex flex-col justify-between mr-4',
        bordered ? 'border shadow-lg' : ''
      )}
    >
      <div className={clx('flex items-center justify-between px-4 pt-2')}>{header}</div>
      <figure className='relative aspect-square overflow-hidden rounded sm:rounded-box'>
        {image}
      </figure>
      {imageActions}
      <div className={clx('card-body')}>{body}</div>
    </div>
  )
}
