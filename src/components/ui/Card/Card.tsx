import React from 'react'

export interface CardProps {
  image: JSX.Element
  header?: string | JSX.Element
  imageActions?: JSX.Element | undefined
  body: string | JSX.Element
  styles?: string
}

export default function Card ({
  header,
  image,
  imageActions,
  body,
  styles = 'bg-base-100 drop-shadow rounded-box'
}: CardProps): JSX.Element {
  return (
    <div className={styles}>
      <CardHeader content={header} />
      <div className='card card-compact rounded-none'>
        {image}
        {imageActions}
        <CardBody content={body} />
      </div>
    </div>
  )
}

export interface CardHeaderProps {
  content: any
  styles?: string
}
export const CardHeader = ({
  content,
  styles = 'container mx-auto bg-base-100 rounded-box'
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
