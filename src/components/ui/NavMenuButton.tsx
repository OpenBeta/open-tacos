import React from 'react'
import { Button } from './BaseButton'

interface NavMenuButtonProps {
  to: string
  label: string | JSX.Element
  cta?: boolean
}

export default function NavMenuButton ({ label, to, cta = false }: NavMenuButtonProps): JSX.Element {
  return (
    <Button href={to} label={label} variant={cta ? Button.VARIANT_SOLID_SECONDARY : Button.VARIANT_TEXT_CONTRAST} />
  )
}
