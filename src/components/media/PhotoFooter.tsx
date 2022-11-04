import Link from 'next/link'
import { Transition } from '@headlessui/react'
import { UserCircleIcon, TagIcon } from '@heroicons/react/24/outline'
import { urlResolver } from '../../js/utils'

export default function PhotoFooter ({
  username,
  destType,
  destination,
  hover
}): JSX.Element {
  return (
    <Transition
      show={hover}
      enter='transition-opacity duration-250'
      enterFrom='opacity-20'
      enterTo='opacity-100'
    >
      {destination != null && (
        <DestinationLink destType={destType} destination={destination} />
      )}
      {username != null && <PhotographerLink uid={username} />}
    </Transition>
  )
}

const PhotographerLink = ({ uid }: { uid: string }): JSX.Element => (
  <Link href={urlResolver(3, uid) ?? '#'} passHref>

    <span className='absolute bottom-2 right-2 rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-1'>
      <UserCircleIcon className='text-black w-6 h-6' />
    </span>

  </Link>)

const DestinationLink = ({
  destType,
  destination
}: {
  destType: number
  destination: string
}): JSX.Element | null => {
  const url = urlResolver(destType, destination)
  if (url == null) return null
  return (
    <Link href={url} passHref>
      <span className='absolute bottom-2 left-2 rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-2'>
        <TagIcon className='text-black w-4 h-4' />
      </span>
    </Link>
  )
}
