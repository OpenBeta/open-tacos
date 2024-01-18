import * as Popover from '@radix-ui/react-popover'
import { MapAreaFeatureProperties } from './AreaMap'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { Card } from '../core/Card'
import { EntityIcon } from '@/app/editArea/[slug]/general/components/AreaItem'

/**
 * Area info panel
 */
export const AreaInfoDrawer: React.FC<{ data: MapAreaFeatureProperties | null, onClose?: () => void }> = ({ data, onClose }) => {
  const parent = data?.parent == null ? null : JSON.parse(data.parent)
  const parentName = parent?.name ?? 'Unknown'
  const parentId = parent?.id ?? null
  return (
    <Popover.Root open={data != null}>
      <Popover.Anchor className='absolute top-3 left-3 z-50' />
      <Popover.Content align='start'>
        {data != null && <Content {...data} parentName={parentName} parentId={parentId} />}
      </Popover.Content>
    </Popover.Root>
  )
}

export const Content: React.FC<MapAreaFeatureProperties & { parentName: string, parentId: string | null }> = ({ id, name, parentName, parentId }) => {
  const url = parentId == null
    ? parentName
    : (
      <a
        href={getAreaPageFriendlyUrl(parentId, name)}
        className='inline-flex items-center gap-1.5'
      >
        <EntityIcon type='area' size={16} /><span className='text-secondary font-medium hover:underline '>{parentName}</span>
      </a>
      )
  return (
    <Card>
      <div className='flex flex-col gap-y-1 text-xs'>
        <div>{url}</div>
        <div className='ml-2'>
          <span className='text-secondary'>&#8735;</span><a href={getAreaPageFriendlyUrl(id, name)} className='text-sm font-medium hover:underline'>{name}</a>
        </div>
      </div>
    </Card>
  )
}
