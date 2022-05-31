import { useSession } from 'next-auth/react'
import { Button, ButtonVariant } from '../ui/BaseButton'
export default function EditProfileButton (): JSX.Element | null {
  const session = useSession()
  if (session.status === 'authenticated') {
    return (<Button href='/account/edit' label='Edit' variant={ButtonVariant.OUTLINED_DEFAULT} size='sm' />)
  }
  return null
}
