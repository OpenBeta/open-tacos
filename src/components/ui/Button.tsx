import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, className, ...rest }) => {
  return (
    <button
      className={`${className} btn whitespace-nowrap ${'btn-secondary'} ${'px-4'}`}
      onClick={onClick}
      {...rest}
    >
      {label}
    </button>
  )
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: JSX.Element | JSX.Element[] | string
}

export const LinkButton: React.FC<LinkButtonProps> = ({ href, children, className, ...rest }) => {
  if (href == null) {
    return null
  }

  if (href.startsWith('http')) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} passHref>
      <a className={className} {...rest}>
        {children}
      </a>
    </Link>
  )
}
