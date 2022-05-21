import React from 'react'
import { Button, ButtonVariant } from './BaseButton'

interface NavMenuButtonProps {
  to?: string
  label: string | JSX.Element
  variant?: ButtonVariant
  onClick?: () => void
}

export default function NavMenuButton ({ label, to, variant, onClick }: NavMenuButtonProps): JSX.Element {
  return (
    <Button href={(onClick != null) ? undefined : to ?? '#'} onClick={onClick} label={label} variant={variant ?? ButtonVariant.TEXT_CONTRAST} />
  )
}
