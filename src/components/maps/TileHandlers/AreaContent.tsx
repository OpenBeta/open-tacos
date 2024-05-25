import Link from 'next/link'
import { CragGroupFeatureProps, SubArea } from '../TileTypes'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { Card } from '../../core/Card'
import { EntityIcon } from '@/app/(default)/editArea/[slug]/general/components/AreaItem'
import { MiniCarousel } from '../CardGallery'

export const AreaPanelContent: React.FC<CragGroupFeatureProps> = ({ id, areaName: name, subareas }) => {
  const editUrl = `/editArea/${id}/general`
  return (
    <Card>
      <div className='flex flex-col gap-4'>
        <section className='flex flex-col gap-y-2'>
          <Link className='text-lg font-medium leading-snug tracking-tight hover:underline' href={getAreaPageFriendlyUrl(id, name)}>{name}</Link>
          <Subheading subareas={subareas} />
        </section>

        <a className='btn btn-primary btn-outline btn-sm no-animation' href={editUrl}>Edit area</a>

        <hr />
      </div>
    </Card>
  )
}

export const AreaHoverCardContent: React.FC<CragGroupFeatureProps> = ({ id, areaName: name, subareas, media }) => {
  return (
    <Card image={<MiniCarousel mediaList={media} />}>
      <a
        href={getAreaPageFriendlyUrl(id, name)}
        className='text-base font-medium tracking-tight hover:underline'
        onClick={(e) => e.stopPropagation()}
      >
        {name}
      </a>
      <Subheading subareas={subareas} />
    </Card>
  )
}

const Subheading: React.FC<{ subareas: SubArea[] }> = ({ subareas }) => {
  return (
    <div className='font-sm text-secondary flex items-center gap-4'>
      <span className='bg-area-cue/80 text-base-100 p-1'>
        <EntityIcon type='area' size={16} />
      </span>
      <span className='text-xs uppercase'><b>{subareas.length}</b> Sub-areas</span>
    </div>
  )
}
