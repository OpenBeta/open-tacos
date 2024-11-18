import React from 'react'
import { XCircle } from '@phosphor-icons/react/dist/ssr'

/**
 * Suppress banner button
 */
export const SuppressButton: React.FC<{ onClick: React.MouseEventHandler<HTMLButtonElement> }> = ({ onClick }) => (
  <button
    className='btn btn-link btn-sm btn-primary font-light text-xs'
    onClick={onClick}
  >
    Don't show this again <XCircle size={32} weight='light' />
  </button>
)
