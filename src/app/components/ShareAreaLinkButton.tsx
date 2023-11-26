'use client'
import { useState, useEffect } from 'react'
import { LinkSimple, Check } from '@phosphor-icons/react/dist/ssr'

import { getFriendlySlug } from '@/js/utils'
import { ControlledTooltip } from '@/components/ui/Tooltip'

/**
 * Copy area link to clipboard button
 */
export const ShareAreaLinkButton: React.FC<{ uuid: string, areaName: string }> = ({ uuid, areaName }) => {
  const slug = getFriendlySlug(areaName)
  const url = `https://openbeta.io/area/${uuid}/${slug}`

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
        className='btn' onClick={() => {
          void navigator.clipboard.writeText(url)
          setClicked(true)
        }}
      >
        <LinkSimple size={20} />Share
      </button>
    </ControlledTooltip>
  )
}
