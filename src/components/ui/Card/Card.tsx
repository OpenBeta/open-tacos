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
      <div className='flex items-center justify-between'>{header}</div>
      <figure className='overflow-hidden rounded-box'>
        {image}
      </figure>
      {imageActions}
      <CardBody content={body} />
    </div>
  // </div>
  )
}

export interface CardHeaderProps {
  content: any
  styles?: string
}
export const CardHeader = ({
  content,
  styles = 'container mx-auto'
}: CardHeaderProps): JSX.Element => {
  return (
    <div className={styles}>
      <div data-test='cardHeader'>{content}</div>
    </div>
  )
}

export interface CardBodyProps {
  content: any
  styles?: string
}
export const CardBody = ({
  content,
  styles = 'card-body'
}: CardBodyProps): JSX.Element => {
  return (
    <div data-test='cardBody' className={styles}>
      {content}
    </div>
  )
}
