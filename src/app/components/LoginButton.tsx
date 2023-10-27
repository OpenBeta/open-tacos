'use client'
import { signIn } from 'next-auth/react'

/**
 * Client-side button
 */
export const LoginButtonClient: React.FC<{ className: string, label: string }> = ({ className, label }) => {
  return (
    <button
      className={className} onClick={() => {
        void signIn('auth0')
      }}
    >{label}
    </button>
  )
}
