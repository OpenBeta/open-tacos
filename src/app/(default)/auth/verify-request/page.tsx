import { Metadata } from 'next'
import { VerifyEmailPendingContent } from './VerifyEmailPendingContent'

export const metadata: Metadata = {
  title: 'Email verification pending - OpenBeta'
}

// Force dynamic rendering since page uses searchParams
export const dynamic = 'force-dynamic'

export default function VerifyEmailPendingPage (): React.JSX.Element {
  return <VerifyEmailPendingContent />
}
