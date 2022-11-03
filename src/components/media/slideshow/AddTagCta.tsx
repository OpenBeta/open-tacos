import { signIn } from 'next-auth/react'
import { PlusIcon } from '@heroicons/react/24/outline'

import { WithPermission } from '../../../js/types/User'
import { Button, ButtonVariant } from '../../ui/BaseButton'

interface AddTagCtaProps {
  auth: WithPermission
  tagCount: number
}
export default function AddTagCta ({ auth, tagCount }: AddTagCtaProps): JSX.Element | null {
  const { isAuthenticated, isAuthorized } = auth
  if (isAuthorized) return null // the user is looking their own page

  let message: any
  if (tagCount === 0 && !isAuthenticated) {
    message = Messages.TAG_YOUR_OWN
  } else if (isAuthenticated && !isAuthorized) {
    message = Messages.TO_YOUR_PROFILE
    message.href = '/api/user/me'
  } else {
    message = Messages.LOGIN
  }

  const action = message?.href != null
    ? { href: message.href }
    : { onClick: onClickHandler }
  return (
    <div className='text-sm px-4 py-6 bg-ob-primary bg-opacity-90'>
      <div className='font-bold mb-2'>{message.heading}</div>
      <div className='flex items-center space-x-2'>
        <Button
          label={
            <div className='border-2 border-gray-800 p-1 rounded border-dashed'>
              <PlusIcon className='w-8 h-8 stroke-1' />
            </div>
            }
          {...action}
        />
        <Button
          label={message.cta}
          variant={ButtonVariant.SOLID_DEFAULT}
          {...action}
        />
      </div>
    </div>
  )
}

const onClickHandler = async (): Promise<any> => await signIn('auth0')

const Messages = {
  TAG_YOUR_OWN: {
    heading: 'Your photo?',
    cta: 'Log in to tag this climb',
    onClick: onClickHandler
  },

  LOGIN:
  {
    heading: '',
    cta: 'Log in to share a photo',
    onClick: onClickHandler
  },

  TO_YOUR_PROFILE:
  {
    heading: 'Have a photo to share?',
    cta: 'Go to your profile',
    onClick: () => {}
  }

}
