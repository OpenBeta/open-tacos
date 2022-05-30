import { IUserProfile } from '../../js/types'

interface PublicProfileProps {
  userProfile: IUserProfile
}

export default function PublicProfile ({ userProfile }: PublicProfileProps): JSX.Element {
  const { fullName, nick, avatar, bio } = userProfile
  return (
    <div className='mx-auto max-w-screen-sm grid grid-cols-3'>
      <div>
        <img className='rounded-full' src={avatar} />
      </div>
      <div className='col-span-2 text-medium'>
        <div className='text-2xl font-semibold'>{nick}</div>
        <div className='mt-8 text-lg font-semibold'>{fullName}</div>
        <div className=''>{bio}</div>
      </div>

    </div>
  )
}
