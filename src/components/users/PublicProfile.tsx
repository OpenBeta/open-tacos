import { useCallback } from 'react'
import Link from 'next/link'

import { IUserProfile } from '../../js/types/User'
import EditProfileButton from './EditProfileButton'

interface PublicProfileProps {
  userProfile: IUserProfile
  onClick?: () => void
}

export default function PublicProfile ({ userProfile }: PublicProfileProps): JSX.Element {
  const { name, nick, avatar, bio } = userProfile
  return (
    <section className='mx-auto max-w-screen-sm px-4 md:px-0 md:grid md:grid-cols-3'>
      <div className='hidden md:block grayscale'>
        <img className='rounded-full hue-rotate-15' src={avatar} />
      </div>
      <div className='md:col-span-2 text-medium text-primary'>
        <div className='flex flex-row items-center'>
          <div className='text-2xl font-bold mr-4'>{nick}</div>
          <EditProfileButton ownerProfile={userProfile} />
        </div>
        <div className='mt-6 text-lg font-semibold'>{name}</div>
        <div className=''>{bio}</div>
      </div>
    </section>
  )
}

export const TinyProfile = ({ userProfile, onClick }: PublicProfileProps): JSX.Element => {
  const onClickHandler = useCallback((event) => {
    if (onClick != null) {
      event.stopPropagation()
      event.preventDefault()
      onClick()
    }
  }, [])
  const { nick, avatar } = userProfile
  return (

    <Link href={`/u/${nick}`}>
      <a onClick={onClickHandler}>
        <section className='flex items-center space-x-2.5'>
          <div className='grayscale'>
            <img className='rounded-full' src={avatar} width={32} height={32} />
          </div>
          <div className={ProfileATagStyle}>
            {nick}

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
