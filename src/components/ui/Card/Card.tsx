import React from 'react'

export interface CardProps {
  image: JSX.Element
  header?: string | JSX.Element
  imageActions?: JSX.Element | undefined
  body: string | JSX.Element
}

export default function Card ({
  header,
  image,
  imageActions,
  body
}: CardProps): JSX.Element {
  return (
    <div className='card card-compact'>
      <div className='px-2 sm:px-0 flex items-center justify-between'>{header}</div>
      <figure className='overflow-hidden rounded sm:rounded-none sm:rounded-box'>
        {image}
      </figure>
      {imageActions}
      <div className='card-body'>{body}</div>
    </div>
  )
}
