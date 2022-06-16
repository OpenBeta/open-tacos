import { PlusIcon } from '@heroicons/react/outline'
import { signIn } from 'next-auth/react'
import { Button, ButtonVariant } from '../../ui/BaseButton'
export default function AddTagCta (): JSX.Element {
  return (
    <div className='text-sm px-4 py-6 bg-ob-primary bg-opacity-90'>
      <div className='font-bold mb-2'>Your photo?</div>
      <div className='flex items-center space-x-2'>
        <Button
          label={
            <div className='border-2 border-gray-800 p-1 rounded border-dashed'>
              <PlusIcon className='w-8 h-8 stroke-1' />
            </div>
            }
          onClick={onClickHandler}
        />
        <Button
          label='Log in to tag this climb'
          variant={ButtonVariant.SOLID_DEFAULT}
          onClick={onClickHandler}
        />
      </div>
    </div>
  )
}

const onClickHandler = async (): Promise<void> => await signIn('auth0')
