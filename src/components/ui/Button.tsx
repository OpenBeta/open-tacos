import React from 'react'
import Link from 'next/link'

export function Button ({ label, onClick, className }): any {
  return (
    <button
      className={`${className as string} btn whitespace-nowrap 
      ${'btn-secondary'} ${'px-4'}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export interface LinkButtonProps {
  href: string
  children: JSX.Element | JSX.Element[] | string
  className: string
  theRest?: any
}

/**
 * Make URL link looks like a button.  In most cases you should try to use
 * HTML `<a href=` for external link and NextJS `Link` for client-side routing.
 */
export const LinkButton = ({ href, children, className, theRest }: LinkButtonProps): any => {
  if (href == null) {
    return null
  }
  if (href.startsWith('http')) {
    return (
      <a href={href} {...theRest}>
        <button className={className}>
          {children}
        </button>
      </a>
    )
  }
  return (
    <Link href={href} {...theRest}>
      <a>
        <button className={className}>
          {children}
        </button>
      </a>
    </Link>
  )
}
