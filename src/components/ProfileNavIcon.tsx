import { useSession } from 'next-auth/react'
import { UserCircleIcon } from '@heroicons/react/outline'
export default function ProfileNavIcon (): JSX.Element | null {
  const { status } = useSession()
  if (status === 'authenticated') {
    return (<a href='/api/user/me' className='rounded-full bg-ob-secondary p-1'><UserCircleIcon className='w-5 h-5' /></a>)
  }
  return null
}
