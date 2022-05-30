import { useSession } from 'next-auth/react'

export default function EditProfileButton (): JSX.Element | null {
  const session = useSession()
  if (session.status === 'authenticated') {
    return (<a href='/account/edit'><button className='text-primary text-sm border-2 border-gray-600 rounded-md px-2 py-0.25'>Edit</button></a>)
  }
  return null
}
