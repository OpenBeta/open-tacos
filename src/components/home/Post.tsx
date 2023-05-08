import Link from 'next/link'
import React from 'react'
import { MediaType } from '../../js/types'
import {
  UserCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { getUploadDateSummary, urlResolver } from '../../js/utils'
import { ATagWrapper } from '../Utils'

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
  username?: string
}

export const PostHeader = ({
  profilePhoto = null,
  username
}: PostHeaderProps): JSX.Element | null => {
  if (username == null) return null

  return (
    <>
      <ATagWrapper href={urlResolver(3, username)} className='flex py-2 items-center space-x-2 text-base-300'>
        {profilePhoto != null
          ? (
            <div className='cursor-pointer' />
            )
          : (
            <UserCircleIcon className='h-6 w-6' />
            )}
        <div className='text-sm text-base-300 font-semibold'>{username}</div>
      </ATagWrapper>
    </>
  )
}
