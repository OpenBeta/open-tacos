'use client'

import { SessionProvider } from 'next-auth/react'

export const dynamic = 'force-dynamic'

export default function BasecampLayout ({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return <SessionProvider>{children}</SessionProvider>
}
