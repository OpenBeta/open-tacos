import Link from 'next/link'
import { CragGroupFeatureProps, SubArea } from '../TileTypes'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { EntityIcon } from '@/app/(default)/editArea/[slug]/general/components/AreaItem'
import { BaseDrawerContent } from './Drawer'
import { MiniCarousel } from '../CardGallery'

export const CUSTOM_CLASS = 'max-h-screen lg:w-[420px] rounded-none'

export const AreaDrawerContent: React.FC<CragGroupFeatureProps> = ({ id, areaName: name, subareas, totalClimbs, media }) => {
  const editUrl = `/editArea/${id}/general`
  return (
    <BaseDrawerContent
      media={<MiniCarousel mediaList={media} />}
      heading={<Link href={getAreaPageFriendlyUrl(id, name)}>{name}</Link>}
      subheading={<Subheading subareas={subareas} totalClimbs={totalClimbs} />}
      cta={<Link className='btn btn-primary btn-outline btn-sm no-animation' href={editUrl}>Edit area</Link>}
    >
      <SubAreas subareas={subareas} />
    </BaseDrawerContent>
  )
}

const SubAreas: React.FC<{ subareas: SubArea[] }> = ({ subareas }) => {
  return (
    <ol className=''>
      {subareas.map(({ id, areaName, totalClimbs }, idx) => (
        <li key={id} className='py-1 flex items-center gap-1'>
          <span className='shrink-0 text-sm text-secondary text-right w-8'>{idx + 1}.</span>
          <Link href={getAreaPageFriendlyUrl(id, areaName)} className='grow flex justify-between overflow-hidden gap-4'>
            <div className='hover:underline truncate'>{areaName}</div>
            <div className='flex items-center text-secondary gap-1 w-12 shrink-0'>
              <EntityIcon type='climb' size={16} withLabel={false} />
              {totalClimbs}
            </div>
          </Link>
        </li>))}
    </ol>
  )
}

export const AreaHoverCardContent: React.FC<CragGroupFeatureProps> = ({ id, areaName: name, subareas, media, totalClimbs }) => {
  return (
    <>
      <a
        href={getAreaPageFriendlyUrl(id, name)}
        className='text-lg font-semibold tracking-tight hover:underline'
        onClick={(e) => e.stopPropagation()}
      >
        {name}
      </a>
      <Subheading subareas={subareas} totalClimbs={totalClimbs} />
    </>
  )
}

const Subheading: React.FC<{ subareas: SubArea[], totalClimbs: number }> = ({ subareas, totalClimbs }) => {
  return (
    <div className='flex items-center gap-4 tracking-tight text-xs'>
      <span className='bg-area-cue/80 text-base-100 p-1'>
        <EntityIcon type='area' size={16} />
      </span>
      <span className='uppercase flex items-center gap-1'>
        <EntityIcon type='area' size={16} withLabel={false} />{subareas.length} <span className='hidden md:inline'>Sub-areas</span>
      </span>
      <span className='uppercase flex items-center gap-1'>
        <EntityIcon type='climb' size={16} withLabel={false} />{Intl.NumberFormat().format(totalClimbs)} climbs
      </span>
    </div>
  )
}
