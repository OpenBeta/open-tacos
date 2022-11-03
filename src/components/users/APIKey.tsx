import { KeyIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

import { WithOwnerProfile } from '../../js/types/User'
import forOwnerOnly from '../../js/auth/forOwnerOnly'

const APIKey = (props: WithOwnerProfile): JSX.Element | null => {
  const { data } = useSession({ required: true })

  const apiKey: string | undefined = (data?.accessToken as string) ?? undefined

  if (data == null || apiKey == null) return null
  return (
    <div className='hidden lg:block tooltip tooltip-bottom tooltip-info' data-tip='Copy API key to clipboard'>
      <button
        className='block'
        onClick={async () => {
          await navigator.clipboard.writeText(apiKey)
        }}
      ><KeyIcon className='w-6 h-6' />
      </button>
    </div>
  )
}

export default forOwnerOnly<WithOwnerProfile>(APIKey)
