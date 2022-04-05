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

export const FilterToggleButton = ({ selected, label, onClick }) => {
  return (
    <button type='button' role='checkbox' aria-checked={selected} onClick={onClick} className={`border-2 rounded-2xl  btn-small active:scale-95 ${selected ? 'border-neutral-800 text-neutral-800' : 'border-neutral-400 text-neutral-400 hover:border-neutral-600'}`}>
      {label}
    </button>
  )
}

export function TextButton ({ label, to, clz, className, onClick }) {
  return (
    <SmartLink url={to} clz={clz}>
      <MyButton className={className} onClick={onClick} label={label} />
    </SmartLink>
  )
}

const MyButton = React.forwardRef(({ className, onClick, label }, ref) =>
  (
    <button onClick={onClick} ref={ref} className={`border rounded-2xl  text-slate-100 text-lg  border-gray-600 hover:text-custom-green hover:border-custom-green ${className}`}>
      {label}
    </button>
  )
)

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

/**
 * Children is simple html.  If passing complex component, must wrap it 'ref'.
 * See https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component
 * @param {*} url
 * @param {*} children
 * @returns
 */
export const SmartLink = ({ url, clz = '', children }) => {
  const regEx = /^http/
  return regEx.test(url) ? (<Link href={url} className={clz} passHref>{children}</Link>) : (<a href={url} className={clz}>{children}</a>)
}
