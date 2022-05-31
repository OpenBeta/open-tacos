import { IUserProfile } from '../../js/types/User'
import EditProfileButton from './EditProfileButton'

interface PublicProfileProps {
  userProfile: IUserProfile
}

export default function PublicProfile ({ userProfile }: PublicProfileProps): JSX.Element {
  const { name, nick, avatar, bio } = userProfile
  return (
    <section className='mx-auto max-w-screen-sm md:grid md:grid-cols-3'>
      <div className='hidden md:block'>
        <img className='rounded-full hue-rotate-15' src={avatar} />
      </div>
      <div className='md:col-span-2 text-medium text-primary'>
        <div className='flex flex-row items-center'>
          <div className='text-2xl font-bold mr-4'>{nick}</div>
          <EditProfileButton />
        </div>
        <div className='mt-6 text-lg font-semibold'>{name}</div>
        <div className=''>{bio}</div>
      </div>
    </section>
  )
}
