import React from 'react'

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

export const FilterToggleButton = ({ selected, label, onClick }) => {
  return (
    <button type='button' role='checkbox' aria-checked={selected} onClick={onClick} className={`border-2 rounded-2xl  btn-small active:scale-95 ${selected ? 'border-neutral-800 text-neutral-800' : 'border-neutral-400 text-neutral-400 hover:border-neutral-600'}`}>
      {label}
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
