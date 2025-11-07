'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

const PhotographerLink = ({ uid }: { uid: string }): JSX.Element => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    const url = urlResolver(3, uid, '')
    if (url != null) {
      router.push(url)
    }
  }

  return (
    <button
      onClick={handleClick}
      className='absolute bottom-2 right-2 rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-1'
      aria-label={`View ${uid}'s profile`}
    >
      <UserCircleIcon className='text-ob-dark w-6 h-6' />
    </button>
  )
}

/**
 * A component that shows all tags when clicked
 */
const AllTagsLink: React.FC<{ entityTags: EntityTag[] }> = ({ entityTags }) => {
  const router = useRouter()
  const [showTags, setShowTags] = useState(false)

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    setShowTags(!showTags)
  }

  const handleTagClick = (e: React.MouseEvent, url: string): void => {
    e.preventDefault()
    e.stopPropagation()
    router.push(url)
  }

  return (
    <div className='absolute bottom-2 left-2'>
      <button
        onClick={handleClick}
        className='rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-2'
        aria-label={`Show ${entityTags.length} tags`}
        title={`Show ${entityTags.length} tags`}
      >
        <TagIcon className='text-ob-dark w-4 h-4' />
      </button>

      {showTags && (
        <div
          className='absolute bottom-full left-0 mb-2 p-3 bg-base-100 rounded-lg shadow-lg border w-40 z-50'
          role='dialog'
          aria-label='Photo tags'
        >
          <div className='text-sm font-semibold mb-2'>Tags:</div>
          <ul className='space-y-1' role='list'>
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
                  <button
                    onClick={(e) => handleTagClick(e, tagUrl)}
                    className='text-ob-primary hover:opacity-80 hover:underline text-left'
                  >
                    {tagName}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
