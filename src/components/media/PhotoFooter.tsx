import Link from 'next/link'
import { Transition } from '@headlessui/react'
import { UserCircleIcon, TagIcon } from '@heroicons/react/24/outline'
import { urlResolver } from '../../js/utils'
import { MediaWithTags, SimpleTag } from '../../js/types'

interface PhotoFooterProps {
  mediaWithTags: MediaWithTags
  hover: boolean
}

export default function PhotoFooter ({
  mediaWithTags,
  hover
}: PhotoFooterProps): JSX.Element {
  const { username, climbTags, areaTags } = mediaWithTags
  let firstTag: SimpleTag | null
  if (climbTags.length > 0) {
    firstTag = climbTags[0]
  } else if (areaTags.length > 0) {
    firstTag = areaTags[0]
  } else {
    firstTag = null
  }
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

type DescriptionLinkProps = SimpleTag
/**
 * A link to a tag
 */
const DestinationLink: React.FC<DescriptionLinkProps> = ({
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
