import classNames from 'classnames'
import { XCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
interface TagsProps {
  hovered: boolean
  list: any [] // array of tags
}
export default function Tags ({ hovered, list }: TagsProps): JSX.Element {
  console.log('#list', list)
  return (
    <div className={
          classNames(
            'text-xs px-1.5 py-1 flex flex-wrap justify-start space-x-2 space-y-0.5 bg-neutral-50 bg-opacity-20',
            hovered ? 'bg-opacity-80' : '')
          }
    >
      {list.map(tag =>
        <Tag
          key={tag.mediaUuid}
          tag={tag} onClick={() => {

          }}
        />)}
    </div>
  )
}

interface PhotoTagProps {
  tag: any
  onClick: () => void
}
const Tag = ({ tag, onClick }: PhotoTagProps) => {
  const { climb } = tag
  return (
    <span className='border-neutral-400 bg-neutral-200 bg-opacity-40 border rounded-lg inline-flex items-center'>
      <Link href={`/climbs/${climb.id}`} passHref><a className='whitespace-nowrap truncate px-1 hover:underline'>{climb.name}</a></Link><span onClick={onClick}><XCircleIcon className='w-4 h-4' /></span>
    </span>
  )
}
