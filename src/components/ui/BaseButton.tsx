import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'

interface BaseButtonProps {
  onClick?: any
  label: string | JSX.Element
  variant?: string
  size?: string
  href?: string
}

export const BaseButton = React.forwardRef<HTMLInputElement, BaseButtonProps>(({
  onClick = null,
  label,
  variant = Button.VARIANT_DEFAULT,
  size = Button.SIZE_MD
}: BaseButtonProps, ref: any): JSX.Element => {
  return (
    <button
      type='button'
      onClick={onClick}
      ref={ref}
      className={classnames(
        'cursor-pointer',
        variant,
        size
      )}
    >
      {label}
    </button>
  )
})

export const Button = ({
  onClick, label,
  variant,
  href,
  size
}: BaseButtonProps): JSX.Element => {
  if (href !== undefined) {
    return (
      <Link href={href} passHref>
        <BaseButton onClick={onClick} label={label} variant={variant} />
      </Link>
    )
  }
  return (<BaseButton onClick={onClick} label={label} variant={variant} />)
}

Button.SIZE_MD = 'px-2.5 py-1 text-base'
Button.VARIANT_DEFAULT = 'text-primary hover:underline'
Button.VARIANT_TEXT_CONTRAST = 'text-white hover:underline'
Button.VARIANT_OUTLINED_PRIMARY = 'text-white border rounded-md bg-inherit text-ob-primary border-ob-primary drop-shadow-sm hover:ring-2'
Button.VARIANT_SOLID_SECONDARY = 'border-0 rounded-md bg-ob-secondary text-black drop-shadow-sm hover:ring-2'
Button.VARIANT_SOLID_DEFAULT = 'border-0 rounded-md bg-slate-800 text-white drop-shadow-sm'
