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

export function TextButton ({ label, to, clz, onClick }) {
  return (
    <SmartLink url={to} clz={clz}>
      <MyButton onClick={onClick} label={label} />
    </SmartLink>
  )
}

const MyButton = React.forwardRef(({ onClick, label }, ref) =>
  (
    <button onClick={onClick} ref={ref} className='border rounded-lg py-2 px-6 text-slate-100 text-lg hover:text-custom-green hover:border-custom-green'>
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
