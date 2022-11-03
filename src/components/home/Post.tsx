import Link from 'next/link'
import React from 'react'
import { MediaType } from '../../js/types'
import {
  UserCircleIcon,
  TagIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import { getUploadDateSummary, urlResolver } from '../../js/utils'

export interface PostBodyProps {
  destUrl: string
  mtime: Date
  title: string
}

export function PostBody ({
  destUrl,
  mtime,
  title
}: PostBodyProps): JSX.Element {
  return (
    <>
      <Link href={destUrl}>
        <h2 className='cursor-pointer card-title'>{title}</h2>
      </Link>
      <div className='card-actions items-center relative py-2'>
        <div className='absolute left-0'>{getUploadDateSummary(mtime)}</div>
        <Link href={destUrl}>
          <div className='absolute right-0'>
            <Link href={destUrl} passHref>
              <a>
                <div className='rounded-full bg-gray-100 bg-opacity-70 hover:bg-opacity-100 hover:ring p-2'>
                  <TagIcon className='text-black w-5 h-5' />
                </div>
              </a>
            </Link>
          </div>
        </Link>
      </div>
    </>
  )
}

export interface PostHeaderProps {
  profilePhoto?: MediaType | null
  username: string
}

export const PostHeader = ({
  profilePhoto = null,
  username
}: PostHeaderProps): JSX.Element => {
  return (
    <div className='px-1 flex justify-between items-center'>
      <div>
        <div className='flex py-2 items-center space-x-2'>
          {/* TODO: Add link to user's profile */}

          <Link href={urlResolver(3, username) ?? '#'} passHref>
            {profilePhoto != null
              ? (
                <div className='cursor-pointer' />
                )
              : (
                <UserCircleIcon className='cursor-pointer mx-auto h-6 rounded-box mx-0 shrink-0' />
                )}
          </Link>
          <Link href={urlResolver(3, username) ?? '#'} passHref>
            <div className='cursor-pointer text-left space-y-0.5 text-left'>
              <div className='text-sm text-black font-semibold'>{username}</div>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <div className='dropdown dropdown-end'>
          <EllipsisHorizontalIcon
            tabIndex={0}
            className='px-2 cursor-pointer h-6 rounded-box'
          />
          <ul
            tabIndex={0}
            className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
