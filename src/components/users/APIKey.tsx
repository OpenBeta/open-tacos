import { KeyIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'

export default function APIKey (): JSX.Element | null {
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
