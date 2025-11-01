import Link from 'next/link'
import { useState } from 'react'
import { Transition } from '@headlessui/react'
import { UserCircleIcon, TagIcon } from '@heroicons/react/24/outline'
import { urlResolver, getAreaPageFriendlyUrl } from '@/js/utils'
import { EntityTag, MediaWithTags } from '@/js/types'

interface PhotoFooterProps {
  mediaWithTags: MediaWithTags
  hover: boolean
}

export default function PhotoFooter ({
  mediaWithTags,
  hover
}: PhotoFooterProps): JSX.Element {
  const { username, entityTags } = mediaWithTags

  return (
    <Transition
      show={hover}
      enter='transition-opacity duration-250'
      enterFrom='opacity-20'
      enterTo='opacity-100'
    >
      {entityTags.length > 0 && (
        <AllTagsLink entityTags={entityTags} />
      )}
      {username != null && <PhotographerLink uid={username} />}
    </Transition>
  )
}

const PhotographerLink = ({ uid }: { uid: string }): JSX.Element => (
  <Link href={urlResolver(3, uid, '') ?? '#'} passHref>
    <span className='absolute bottom-2 right-2 rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-1'>
      <UserCircleIcon className='text-black w-6 h-6' />
    </span>
  </Link>
)

/**
 * A component that shows all tags when clicked
 */
const AllTagsLink: React.FC<{ entityTags: EntityTag[] }> = ({ entityTags }) => {
  const [showTags, setShowTags] = useState(false)

  const handleClick = (): void => {
    setShowTags(!showTags)
  }

  return (
    <div className='absolute bottom-2 left-2'>
      <button
        onClick={handleClick}
        className='rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-2'
        aria-label={`Show ${entityTags.length} tags`}
        title={`Show ${entityTags.length} tags`}
      >
        <TagIcon className='text-black w-4 h-4' />
      </button>

      {showTags && (
        <div className='absolute bottom-full left-0 mb-2 p-3 bg-white rounded-lg shadow-lg border w-40 z-50'>
          <div className='text-sm font-semibold mb-2'>Tags:</div>
          <ul className='space-y-1'>
            {entityTags.map((tag, index) => {
              const tagName = tag.climbName ?? tag.areaName ?? 'Untitled'
              const tagUrl = tag.type === 0
                ? `/climb/${tag.targetId}`
                : tag.type === 1
                  ? getAreaPageFriendlyUrl(tag.targetId, tag.areaName)
                  : null

              if (tagUrl == null) {
                return (
                  <li key={index} className='text-xs'>
                    {tagName}
                  </li>
                )
              }

              return (
                <li key={index} className='text-xs'>
                  <Link
                    href={tagUrl}
                    className='text-ob-primary hover:opacity-80 hover:underline'
                  >
                    {tagName}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
