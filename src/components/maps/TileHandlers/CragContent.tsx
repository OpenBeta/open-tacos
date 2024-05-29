import Link from 'next/link'
import { CragFeatureProperties, SimpleClimbType } from '../TileTypes'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { EntityIcon } from '@/app/(default)/editArea/[slug]/general/components/AreaItem'
import { BaseDrawerContent } from './Drawer'
import { MiniCarousel } from '../CardGallery'

export const CragDrawerContent: React.FC<CragFeatureProperties> = ({ id, areaName, climbs, content: { description }, media }) => {
  const friendlyUrl = getAreaPageFriendlyUrl(id, areaName)
  const editUrl = `/editArea/${id}/general`
  return (
    <>
      <BaseDrawerContent
        media={<MiniCarousel mediaList={media} />}
        heading={<Link href={friendlyUrl}>{areaName}</Link>}
        subheading={<Subheading id={id} totalClimbs={climbs.length} />}
        cta={<Link className='btn btn-primary btn-outline btn-sm no-animation' href={editUrl}>Edit area</Link>}
      >
        <section className='text-sm'>
          {description == null || description.trim() === ''
            ? <p className='text-secondary'>No description available. <a className='text-accent hover:underline' href={editUrl}>[Add]</a></p>
            : <p>{description}</p>}
        </section>

        <hr />
        <MicroClimbList climbs={climbs} />
      </BaseDrawerContent>
    </>
  )
}

const Subheading: React.FC<{ id: string, totalClimbs: number }> = ({ id, totalClimbs }) => {
  return (
    <div className='flex items-center gap-4 tracking-tight text-xs'>
      <EntityIcon type='crag' size={16} />
      <span className='uppercase flex items-center gap-1'>
        <EntityIcon type='climb' size={16} withLabel={false} />{Intl.NumberFormat().format(totalClimbs)} climbs
      </span>
    </div>
  )
}

const MicroClimbList: React.FC<{ climbs: SimpleClimbType[] }> = ({ climbs }) => {
  return (
    <section>
      <h3 className='text-base font-semibold text-secondary'>Climbs</h3>
      <ol>
        {climbs.map((climb) => {
          const url = `/climb/${climb.id}`
          return (
            <li key={climb.id} className='text-xs'>
              <a href={url} className='hover:underline'>{climb.name}</a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export const CragHoverCardContent: React.FC<CragFeatureProperties> = ({ id, areaName, climbs }) => {
  return (
    <div className='flex flex-col gap-y-1 text-xs'>
      <a
        href={getAreaPageFriendlyUrl(id, areaName)}
        className='text-base font-medium tracking-tight hover:underline'
        onClick={(e) => e.stopPropagation()}
      >
        {areaName}
      </a>
      <Subheading id={id} totalClimbs={climbs.length} />
    </div>
  )
}
