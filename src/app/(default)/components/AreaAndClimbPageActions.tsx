import Link from 'next/link'
import { PencilSimple, MapTrifold } from '@phosphor-icons/react/dist/ssr'
import clz from 'classnames'

import { SharePageURLButton } from '@/app/(default)/components/SharePageURLButton'
import { UploadPhotoButton } from '@/components/media/PhotoUploadButtons'
import { TagTargetType } from '@/js/types'

/**
 * Main action bar for area & climb page
 */
export const AreaAndClimbPageActions: React.FC<{ uuid: string, name: string, targetType: TagTargetType }> = ({ uuid, name, targetType }) => {
  let url: string
  let sharePath: string
  let enableEdit = true
  let editLabel = 'Edit'
  switch (targetType) {
    case TagTargetType.area:
      url = `/editArea/${uuid}`
      sharePath = `/area/${uuid}`
      break
    case TagTargetType.climb:
      url = `/editClimb/${uuid}`
      sharePath = `/climb/${uuid}`
      enableEdit = false
      editLabel = 'Edit (TBD)'
  }
  return (
    <ul className='flex items-center justify-between gap-2'>
      <Link href={url} target='_new' className={clz('btn no-animation shadow-md', enableEdit ? 'btn-solid btn-accent' : 'btn-disabled')}>
        <PencilSimple size={20} weight='duotone' /> {editLabel}
      </Link>

      <UploadPhotoButton />

      <Link href='#map' className='btn no-animation'>
        <MapTrifold size={20} className='hidden md:inline' /> Map
      </Link>
      <SharePageURLButton path={sharePath} name={name} />
    </ul>
  )
}

/**
 * Skeleton.  Height = actual component's button height.
 */
export const AreaPageActionsSkeleton: React.FC = () => (<div className='w-80 bg-base-200 h-9 rounded-btn' />)
