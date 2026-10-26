'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import clz from 'classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

import { TagsLeaderboardType, TagsByUserType } from '@/js/types'

export interface TagsLeaderboardProps {
  tagsLeaderboard: TagsLeaderboardType
  initialLimit?: number
}

const DEFAULT_LIMIT = 20

export const TagsLeaderboard: React.FC<TagsLeaderboardProps> = ({
  tagsLeaderboard,
  initialLimit = DEFAULT_LIMIT
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const users = tagsLeaderboard?.allTime?.byUsers ?? []
  const hasMore = users.length > initialLimit
  const displayedUsers = isExpanded || !hasMore ? users : users.slice(0, initialLimit)

  return (
    <section className='break-inside-avoid-column break-inside-avoid relative block border-4 p-4 border-black rounded-box mt-4 lg:mb-4'>
      <h2>Tags Leaderboard</h2>
      <div className='grid grid-cols-6 gap-2 items-center'>
        {displayedUsers.map((user, index) => (
          <LeaderboardRow key={user.userUuid !== '' ? user.userUuid : `${index}`} value={user} index={index} />
        ))}
      </div>
      {hasMore && (
        <div className='mt-4 pt-2 border-t border-base-content/10 text-center'>
          <button
            type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            className='btn btn-ghost btn-sm text-xs uppercase tracking-wider inline-flex items-center gap-1.5'
            aria-expanded={isExpanded}
          >
            {isExpanded
              ? (
                <>
                  Show top {initialLimit}
                  <ChevronUpIcon className='w-4 h-4' />
                </>
                )
              : (
                <>
                  Show all ({users.length})
                  <ChevronDownIcon className='w-4 h-4' />
                </>
                )}
          </button>
        </div>
      )}
    </section>
  )
}

const LeaderboardRow: React.FC<{ value: TagsByUserType, index: number }> = ({ value, index }) => {
  const url = `/u/${value?.username ?? ''}`

  return (
    <>
      <div className='text-left align-middle text-sm'>
        <span
          className={clz(
            'p-1 rounded',
            index <= 2 ? 'bg-pink-500 text-white font-semibold' : ''
          )}
        >
          {index + 1}
        </span>
      </div>
      <div className='text-left col-span-4 uppercase thick-link'>
        {value?.username == null ? 'unknown' : <Link href={url} legacyBehavior>{value.username}</Link>}
      </div>
      <div className='text-right font-bold text-sm'>
        {value.total}
      </div>
    </>
  )
}

export default TagsLeaderboard
