'use client'
import { SessionProvider } from 'next-auth/react'

interface Props {
  children?: React.ReactNode
}

export const NextAuthProvider: React.FC<Props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}
