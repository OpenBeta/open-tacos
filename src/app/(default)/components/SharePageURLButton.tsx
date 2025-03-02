'use client'
import { useState, useEffect } from 'react'
import { LinkSimple, Check } from '@phosphor-icons/react/dist/ssr'

import { getFriendlySlug } from '@/js/utils'
import { ControlledTooltip } from '@/components/ui/Tooltip'

/**
 * Copy area/climb URL to clipboard button
 */
export const SharePageURLButton: React.FC<{ path: string, name: string }> = ({ path, name }) => {
  const slug = getFriendlySlug(name)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const optionalSlug = slug !== '' ? `/${slug}` : ''
  const url = `${baseUrl}${path}${optionalSlug}`

  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    let timerId: NodeJS.Timeout
    if (clicked) {
      timerId = setTimeout(() => setClicked(false), 3000)
    }
    return () => clearTimeout(timerId)
  }, [clicked])

  return (
    <ControlledTooltip content={<div className='flex items-center'>Copied <Check size={16} /></div>} open={clicked}>
      <button
        className='btn no-animation' onClick={() => {
          void navigator.clipboard.writeText(url)
          setClicked(true)
        }}
      >
        <LinkSimple size={20} /><span className='hidden md:inline'>Copy Link</span>
      </button>
    </ControlledTooltip>
  )
}
