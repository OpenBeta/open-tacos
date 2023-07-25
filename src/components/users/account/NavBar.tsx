import { useRouter } from 'next/router'
import clx from 'classnames'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const Links = [
  {
    path: '/account/editProfile',
    label: 'Profile'
  },
  {
    path: '/account/changeUsername',
    label: 'Username'
  }
]
export const NavBar: React.FC = () => {
  const router = useRouter()
  return (
    <div className='py-8'>
      <div className='mr-4'>
        <ReturnToPublicProfile />
      </div>
      <div className='lg:ml-4 mt-12 flex flex-col gap-2 max-w-xs'>
        <div className='font-semibold text-base-content/70 text-sm'>ACCOUNT SETTINGS</div>
        {Links.map(({ path, label }) => {
          return (<a key={path} href={path} className={clx('px-4 py-2 rounded-l-lg', router.asPath === path ? 'bg-base-100' : 'hover:bg-base-100/40')}>{label}</a>)
        })}
      </div>
    </div>
  )
}

export const ReturnToPublicProfile: React.FC = () => {
  return <a className='flex gap-2 items-center btn btn-sm btn-outline' href='/api/user/me'><ArrowLeftIcon className='w-5 h-5' />Go to your public profile</a>
}
