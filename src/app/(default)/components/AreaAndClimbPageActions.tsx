import Link from 'next/link'
import { PencilSimple, MapTrifold } from '@phosphor-icons/react/dist/ssr'
import clz from 'classnames'

import { SharePageURLButton } from '@/app/(default)/components/SharePageURLButton'
import { UploadPhotoButton } from '@/components/media/PhotoUploadButtons'
import { TagTargetType } from '@/js/types'

/**
 * Main action bar for area & climb page
 * In an area page, pass in the same uuid for both `uuid` and `parentUuid` but `parentUuid` is not used.
 */
export const AreaAndClimbPageActions: React.FC<{ uuid: string, name: string, targetType: TagTargetType, parentUuid: string }> = ({ uuid, name, targetType, parentUuid }) => {
  let url: string
  let sharePath: string
  let enableEdit = true
  let editLabel = 'Edit'
  let navigateUuid = ''
  switch (targetType) {
    case TagTargetType.area:
      url = `/editArea/${uuid}/general`
      sharePath = `/area/${uuid}`
      navigateUuid = uuid
      break
    case TagTargetType.climb:
      url = `/editClimb/${uuid}`
      sharePath = `/climb/${uuid}`
      enableEdit = false
      editLabel = 'Edit (TBD)'
      navigateUuid = parentUuid ?? ''
  }
  return (
    <ul className='flex items-center justify-between gap-2'>
      <Link href={url} className={clz('btn no-animation shadow-md', enableEdit ? 'btn-solid btn-accent' : 'btn-disabled')}>
        <PencilSimple size={20} weight='duotone' /> {editLabel}
      </Link>

      <UploadPhotoButton />

      <Link href={`/maps?areaId=${navigateUuid}`} className='btn no-animation'>
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
