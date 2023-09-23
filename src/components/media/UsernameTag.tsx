import Link from 'next/link'
import clx from 'classnames'
import { MouseEventHandler } from 'react'

interface UsernameTagProps {
  username: string
}

const UsernameTag: React.FC<UsernameTagProps> = ({ username }) => {
  if (username === undefined || username.trim() === '') return null

  return (
    <div className='w-full'>
      <Link
        href={`/u/${username}`} prefetch={false}
      >
        <a onClick={stopPropagation} className={clx('badge badge-outline hover:underline gap-1 bg-black border border-gray-900 text-white bg-opacity-70')}>
          {username}
        </a>
      </Link>
    </div>
  )
}
const stopPropagation: MouseEventHandler = (event) => event.stopPropagation()

export default UsernameTag
