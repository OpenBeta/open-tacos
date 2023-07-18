import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import ContentLoader from 'react-content-loader'

import { UserPublicProfile } from '../../js/types/User'
// import EditProfileButton from './EditProfileButton'
import ImportFromMtnProj from './ImportFromMtnProj'
import APIKeyCopy from './APIKeyCopy'
import usePermissions from '../../js/hooks/auth/usePermissions'
import forOwnerOnly from '../../js/auth/forOwnerOnly'

interface PublicProfileProps {
  userProfile: UserPublicProfile
  onClick?: () => void
}

export default function PublicProfile ({ userProfile: initialUserProfile }: PublicProfileProps): JSX.Element {
  const [userProfile, setUserProfile] = useState<UserPublicProfile | null>(initialUserProfile)
  const { isAuthorized } = usePermissions({ currentUserUuid: userProfile?.userUuid })

  useEffect(() => {
    setUserProfile(initialUserProfile)
  }, [initialUserProfile])

  const { displayName, username, bio, website, avatar } = userProfile ?? {}
  let websiteWithScheme: string | null = null
  if (website != null) {
    websiteWithScheme = website.startsWith('http') ? website : `//${website}`
  }
  return (
    <section className='mx-auto max-w-screen-sm px-4 md:px-0 md:grid md:grid-cols-3'>
      <div className='hidden md:block pr-5'>
        {avatar == null
          ? <AvatarPlaceholder uniqueKey={2} />
          : <img className='grayscale  object-scale-down w-24 h-24 rounded-full' src={avatar} />}
      </div>
      <div className='md:col-span-2 text-medium text-primary '>
        {username == null && <TextPlaceholder uniqueKey={123} />}

        <div className='flex flex-row items-center gap-x-2 max-w-xs'>
          <div className='md:text-2xl font-bold mr-4 truncate'>
            {username}
          </div>
          {/* <EditProfileButton ownerProfile={initialUserProfile} /> */}
        </div>
        <div className='mt-6 text-lg font-semibold'>{displayName}</div>
        <div className=''>{bio}</div>
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
            <Link href={`/u2/${username}`}>
              <a className='text-xs'>
                <div className='btn btn-outline btn-xs md:btn-sm'> View ticks</div>
              </a>
            </Link>}
          {username != null && isAuthorized && <ImportFromMtnProj isButton username={username} />}
          {userProfile != null && <ChangeUsernameLink userUuid={userProfile?.userUuid} />}
          {userProfile != null && <APIKeyCopy userUuid={userProfile.userUuid} />}
        </div>
      </div>
    </section>
  )
}

const AvatarPlaceholder = (props): JSX.Element => (
  <ContentLoader
    uniqueKey={props.uniqueKey}
    height={96}
    speed={0}
    backgroundColor='rgb(209 213 219)'
    viewBox='0 0 96 96'
    {...props}
  >
    <circle cx='48' cy='48' r='48' />
  </ContentLoader>
)

const TextPlaceholder = (props): JSX.Element => (
  <ContentLoader
    uniqueKey={props.uniqueKey}
    height={108}
    speed={0}
    backgroundColor='rgb(209 213 219)'
    viewBox='0 0 200 108'
    {...props}
  >
    <rect x='0' y='8' rx='2' ry='2' width='120' height='18' />
    <rect x='0' y='60' rx='2' ry='2' width='80' height='18' />
    <rect x='0' y='90' rx='2' ry='2' width='200' height='12' />
  </ContentLoader>
)

/**
 * Remove leading http(s):// and trailing /
 */
const prettifyUrl = (url: string): string => {
  return url.replace(/^(https?:)?\/\//g, '').replace(/\/$/g, '')
}

export const TinyProfile = ({ userProfile, onClick }: PublicProfileProps): JSX.Element => {
  const onClickHandler = useCallback((event) => {
    if (onClick != null) {
      event.stopPropagation()
      event.preventDefault()
      onClick()
    }
  }, [])
  const { username, avatar } = userProfile
  return (

    <Link as={`/u/${username}`} href='/u/[uid]'>
      <a onClick={onClickHandler}>
        <section className='flex items-center space-x-2.5'>
          <div className='grayscale'>
            <img className='rounded-full' src={avatar} width={32} height={32} />
          </div>
          <div className={ProfileATagStyle}>
            {username}
          </div>
        </section>
      </a>
    </Link>

  )
}

interface ProfileATagProps {
  uid: string
  className?: string
}

export const ProfileATag = ({ uid, className = ProfileATagStyle }: ProfileATagProps): JSX.Element => (
  <Link href={`/u/${uid}`}>
    <a className={className}>
      <span>{uid}</span>
    </a>
  </Link>)

const ProfileATagStyle = 'text-primary font-bold hover:underline'

const ChangeUsernameLink = forOwnerOnly(() =>
  <Link href='/account/changeUsername'>
    <a className='btn btn-xs md:btn-sm btn-outline'>Edit profile
    </a>
  </Link>)
