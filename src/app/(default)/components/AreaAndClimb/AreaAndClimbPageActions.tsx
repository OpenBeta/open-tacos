import Link from 'next/link'
import { useMemo } from 'react'
import { PencilSimple, MapTrifold } from '@phosphor-icons/react/dist/ssr'
import clz from 'classnames'

import { SharePageURLButton } from '@/app/(default)/components/SharePageURLButton'
import { UploadPhotoButton } from '@/components/media/PhotoUploadButtons'
import { TagTargetType, AreaType } from '@/js/types'

/**
 * Main action bar for area & climb page
 * In an area page, pass in the same uuid for both `uuid` and `parentUuid` but `parentUuid` is not used.
 */
export const AreaAndClimbPageActions: React.FC<{ uuid: string, name: string, targetType: TagTargetType, parentUuid: string, area: AreaType }> = ({ uuid, name, targetType, parentUuid, area }) => {
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
      enableEdit = true
      editLabel = 'Edit'
      navigateUuid = parentUuid ?? ''
  }

  const mapHref = useMemo(() => {
    const bbox = area?.metadata?.bbox
    const bboxStr = Array.isArray(bbox) ? bbox.join(',') : bbox ?? ''
    const polygon = area?.metadata?.polygon
    const polygonParam = polygon != null ? encodeURIComponent(JSON.stringify(polygon)) : ''
    let href = `/maps?areaId=${navigateUuid}&bbox=${bboxStr}`
    if (polygonParam !== '') {
      href += `&polygon=${polygonParam}`
    }
    return href
  }, [navigateUuid, area])

  return (
    <div className='flex items-center justify-between gap-2'>
      <Link href={url} className={clz('btn no-animation shadow-md', enableEdit ? 'btn-solid btn-accent' : 'btn-disabled')}>
        <PencilSimple size={20} weight='duotone' /> {editLabel}
      </Link>
      <UploadPhotoButton />
      <Link
        href={mapHref}
        className='btn no-animation'
      >
        <MapTrifold size={20} className='hidden md:inline' /> Map
      </Link>
      <SharePageURLButton path={sharePath} name={name} />
    </div>
  )
}

/**
 * Skeleton.  Height = actual component's button height.
 */
export const AreaPageActionsSkeleton: React.FC = () => (<div className='w-80 bg-base-200 h-9 rounded-btn' />)
