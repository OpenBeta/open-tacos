import { KeyIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

import forOwnerOnly, { ForOwnerOnlyProps } from '../../js/auth/forOwnerOnly'

/**
 * A visual button for copying the user's API key to the clipboard.
 */
const APIKeyCopy: React.FC<ForOwnerOnlyProps> = () => {
  const { data } = useSession({ required: true })

  const apiKey: string | undefined = (data?.accessToken as string) ?? undefined

  if (data == null || apiKey == null) return null
  return (
    <div className='hidden lg:block tooltip tooltip-bottom tooltip-info' data-tip='Copy API key to clipboard'>
      <button
        className='block'
        onClick={(e) => {
          e.preventDefault()
          void navigator.clipboard.writeText(apiKey)
        }}
      ><KeyIcon className='w-6 h-6' />
      </button>
    </div>
  )
}

export default forOwnerOnly<ForOwnerOnlyProps>(APIKeyCopy)
