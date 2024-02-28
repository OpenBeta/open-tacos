import * as Popover from '@radix-ui/react-popover'

import { MapAreaFeatureProperties, SimpleClimbType } from './GlobalMap'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { Card } from '../core/Card'
import { EntityIcon } from '@/app/(default)/editArea/[slug]/general/components/AreaItem'

/**
 * Area info panel
 */
export const AreaInfoDrawer: React.FC<{ data: MapAreaFeatureProperties | null, onClose?: () => void }> = ({ data, onClose }) => {
  return (
    <Popover.Root open={data != null}>
      <Popover.Anchor className='absolute top-3 left-3 z-50' />
      <Popover.Content align='start' className='hover:outline-none'>
        {data != null && <Content {...data} />}
      </Popover.Content>
    </Popover.Root>
  )
}

export const Content: React.FC<MapAreaFeatureProperties> = ({ id, areaName, climbs, content: { description }, media }) => {
  const friendlyUrl = getAreaPageFriendlyUrl(id, areaName)
  const editUrl = `/editArea/${id}/general`
  return (
    <Card>
      <div className='flex flex-col gap-4'>
        <section className='flex flex-col gap-y-2'>
          <div className='text-lg font-medium leading-snug tracking-tight'>{areaName}</div>
          <div className='font-sm text-secondary flex items-center gap-1'>
            <EntityIcon type='crag' size={16} />
            ·
            <span className='text-xs font-medium'>{climbs.length} climbs</span>
            <a href={friendlyUrl} className='text-accent text-xs font-semibold ml-auto hover:underline'>Visit page</a>
          </div>
        </section>

        <a className='btn btn-primary btn-outline btn-sm no-animation' href={editUrl}>Edit area</a>

        <hr />

        <section className='text-sm'>
          {description == null || description.trim() === ''
            ? <p className='text-secondary'>No description available. <a className='text-accent hover:underline' href={editUrl}>[Add]</a></p>
            : <p>{description}</p>}
        </section>

        <hr />

        <MicroClimbList climbs={climbs} />
      </div>
    </Card>
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
