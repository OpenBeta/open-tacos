import Link from 'next/link'
import { Transition } from '@headlessui/react'
import { UserCircleIcon, TagIcon } from '@heroicons/react/24/outline'
import { urlResolver } from '../../js/utils'
import { EntityTag, MediaWithTags } from '../../js/types'

interface PhotoFooterProps {
  mediaWithTags: MediaWithTags
  hover: boolean
}

export default function PhotoFooter ({
  mediaWithTags,
  hover
}: PhotoFooterProps): JSX.Element {
  const { username, entityTags } = mediaWithTags
  const firstTag = entityTags.length > 0 ? entityTags[0] : null

  return (
    <Transition
      show={hover}
      enter='transition-opacity duration-250'
      enterFrom='opacity-20'
      enterTo='opacity-100'
    >
      {firstTag != null && (
        <DestinationLink {...firstTag} />
      )}
      {username != null && <PhotographerLink uid={username} />}
    </Transition>
  )
}

const PhotographerLink = ({ uid }: { uid: string }): JSX.Element => (
  <Link href={urlResolver(3, uid) ?? '#'} passHref>
    <a>
      <span className='absolute bottom-2 right-2 rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-1'>
        <UserCircleIcon className='text-black w-6 h-6' />
      </span>
    </a>
  </Link>
)

/**
 * A link to a tag
 */
const DestinationLink: React.FC<EntityTag> = ({
  targetId: id, type
}) => {
  const url = urlResolver(type, id)
  if (url == null) return null
  return (
    <Link href={url}>
      <a>
        <span className='absolute bottom-2 left-2 rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-2'>
          <TagIcon className='text-black w-4 h-4' />
        </span>
      </a>
    </Link>
  )
}
