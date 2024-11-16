'use client'

import { Share } from '@phosphor-icons/react'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

const ShareButton: React.FC = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleShareClick = (): void => {
    const fullUrl = `${window.location.origin}${pathname}${searchParams.toString() !== '' ? '?' + searchParams.toString() : ''}`

    if (typeof navigator.clipboard === 'undefined') {
      toast.error('Clipboard API is not supported in your browser')
      return
    }

    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        toast.success('URL copied to clipboard!')
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error)
        toast.error('Failed to copy URL to clipboard')
      })
  }

  return (
    <button
      onClick={() => handleShareClick()}
      className='btn btn-primary btn-sm no-animation flex items-center gap-2'
      aria-label='Share location'
    >
      <Share size={16} />
      Share
    </button>
  )
}

export { ShareButton }
