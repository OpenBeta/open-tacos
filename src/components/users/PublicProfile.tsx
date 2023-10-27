import { MouseEventHandler } from 'react'
import Link from 'next/link'

import { UserPublicProfile } from '../../js/types/User'
import EditProfileButton from './EditProfileButton'
import ImportFromMtnProj from './ImportFromMtnProj'
import APIKeyCopy from './APIKeyCopy'
import usePermissions from '../../js/hooks/auth/usePermissions'

interface PublicProfileProps {
  userProfile: UserPublicProfile
  onClick?: () => void
}

export default function PublicProfile ({ userProfile }: PublicProfileProps): JSX.Element {
  const { isAuthorized } = usePermissions({ currentUserUuid: userProfile?.userUuid })

  const { displayName, username, bio, website, avatar } = userProfile
  let websiteWithScheme: string | null = null
  if (website != null) {
    websiteWithScheme = website.startsWith('http') ? website : `//${website}`
  }
  return (
    <section className='mx-auto max-w-screen-sm px-4 md:px-0 md:grid md:grid-cols-3'>
      <div className='hidden md:block pr-5'>
        <img className='grayscale  object-scale-down w-24 h-24 rounded-full' src={avatar} />
      </div>
      <div className='md:col-span-2 text-medium text-primary '>
        <div className='flex flex-row items-center gap-x-2 max-w-xs'>
          <div className='md:text-2xl font-bold mr-4 truncate'>
            {username}
          </div>
        </div>
        <div className='mt-6 text-lg font-semibold'>{displayName}</div>
        <div className='whitespace-pre-line'>{bio}</div>
        {websiteWithScheme != null &&
          <div className=''>
            <a
              className='text-ob-secondary hover:underline'
              href={websiteWithScheme}
              target='_blank'
              rel='noopener noreferrer'
            >
              {prettifyUrl(websiteWithScheme)}
            </a>
          </div>}
        <div className='mt-2 flex items-center gap-2'>
          {username != null &&
            <Link href={`/u2/${username}`} className='text-xs'>

              <div className='btn btn-outline btn-xs md:btn-sm'> View ticks</div>

            </Link>}
          {username != null && isAuthorized && <ImportFromMtnProj username={username} />}
          {userProfile != null && <EditProfileButton userUuid={userProfile?.userUuid} />}
          {userProfile != null && <APIKeyCopy userUuid={userProfile.userUuid} />}
        </div>
      </div>
    </section>
  )
}

/**
 * Remove leading http(s):// and trailing /
 */
const prettifyUrl = (url: string): string => {
  return url.replace(/^(https?:)?\/\//g, '').replace(/\/$/g, '')
}

export const TinyProfile = ({ userProfile, onClick }: PublicProfileProps): any => {
  const onClickHandler: MouseEventHandler = (event) => {
    if (onClick != null) {
      event.stopPropagation()
      event.preventDefault()
      onClick()
    }
  }
  const { username, avatar } = userProfile
  return (
    <Link as={`/u/${username}`} href='/u/[uid]' onClick={onClickHandler}>
      <section className='flex items-center space-x-2.5'>
        <div className='grayscale'>
          <img className='rounded-full' src={avatar} width={32} height={32} />
        </div>
        <div className={ProfileATagStyle}>
          {username}
        </div>
      </section>
    </Link>
  )
}

interface ProfileATagProps {
  uid: string
  className?: string
}

export const ProfileATag = ({ uid, className = ProfileATagStyle }: ProfileATagProps): JSX.Element => (
  <Link href={`/u/${uid}`} className={className}>
    <span>{uid}</span>
  </Link>)

const ProfileATagStyle = 'text-primary font-bold hover:underline'
