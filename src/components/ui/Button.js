import React from 'react'
import Link from 'next/link'

/**
 *  TODO: Create MaterialUI-like button with standard styles such as
 *  primary|secondary|default
 */
export function IconButton ({ onClick, children, active, text, className }) {
  return (
    <button
      className={`inline-flex justify-center items-center ${
        active ? 'bg-blue-500' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
      {text && <span className='ml-1 text-sm underline'>{text}</span>}
    </button>
  )
}

export function TextButton ({ label, to }) {
  return (
    <button className='border rounded-lg py-2 px-6 text-slate-100 text-lg hover:text-custom-green hover:border-custom-green'>
      <Link href={to} passHref><a>{label}</a></Link>
    </button>
  )
}

export function Button ({ label, onClick, className }) {
  return (
    <button
      className={`${className} btn whitespace-nowrap 
      ${'btn-secondary'} ${'px-4'}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
