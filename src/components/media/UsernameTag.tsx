import Link from 'next/link'
import clx from 'classnames'
import { MouseEventHandler } from 'react'

interface UsernameTagProps {
  username: string
  size?: 'md' | 'lg'
}
const baseTag = 'badge badge-outline hover:underline max-w-full'
const lgTag = 'badge-lg gap-2'
const mdTag = 'gap-1'
const sizeMap = { md: mdTag, lg: lgTag }

const UsernameTag: React.FC<UsernameTagProps> = ({ username, size = 'md' }) => {
  if (username === undefined || username.trim() === '') return null

  return (
    <div className='w-full'>
      <Link
        href={`/u/${username}`} prefetch={false}
      >
        <a
          onClick={stopPropagation} className={
          clx(baseTag,
            sizeMap[size],
            'bg-black border border-gray-900 text-white bg-opacity-70')
        }
        >
          {username}
        </a>
      </Link>
    </div>
  )
}
const stopPropagation: MouseEventHandler = (event) => event.stopPropagation()

export default UsernameTag
