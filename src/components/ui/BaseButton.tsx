import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'

interface BaseButtonProps {
  onClick?: any
  label: string | JSX.Element
  variant?: ButtonVariant
  size?: string
  href?: string
  type?: 'button' | 'reset' | 'submit'
  disabled?: boolean
}

export const BaseButton = React.forwardRef<HTMLInputElement, BaseButtonProps>(({
  onClick = null,
  label,
  variant = ButtonVariant.DEFAULT,
  size = Button.SIZE_MD,
  type = 'button',
  disabled: disable = false
}: BaseButtonProps, ref: any): JSX.Element => {
  return (
    <button
      type={type}
      onClick={onClick}
      ref={ref}
      className={classnames(
        'cursor-pointer disabled:cursor-auto disabled:disabled:opacity-50',
        variant,
        size
      )}
      disabled={disable}
    >
      {label}
    </button>
  )
})

export const Button = ({
  onClick, label,
  variant,
  href,
  size,
  type = 'button',
  disabled: disable = false
}: BaseButtonProps): JSX.Element => {
  if (href !== undefined) {
    return (
      <Link href={href} passHref>
        <BaseButton onClick={onClick} label={label} variant={variant} type={type} disabled={disable} />
      </Link>
    )
  }
  return (<BaseButton onClick={onClick} label={label} variant={variant} type={type} disabled={disable} />)
}

Button.SIZE_MD = 'px-2.5 py-1 text-base'

export enum ButtonVariant {
  DEFAULT = 'text-primary hover:underline',
  TEXT_CONTRAST = 'text-white hover:underline',
  OUTLINED_PRIMARY = 'text-white border rounded-md bg-inherit text-ob-primary border-ob-primary drop-shadow-sm hover:ring-2',
  SOLID_SECONDARY = 'border-0 rounded-md bg-ob-secondary text-black drop-shadow-sm hover:ring-2',
  SOLID_DEFAULT = 'border-0 rounded-md bg-slate-800 text-white drop-shadow-sm'
}
