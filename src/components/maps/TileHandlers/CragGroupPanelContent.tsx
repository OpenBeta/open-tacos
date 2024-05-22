import { CragGroupFeatureProps } from '../TileTypes'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { Card } from '../../core/Card'
import { EntityIcon } from '@/app/(default)/editArea/[slug]/general/components/AreaItem'

export const CragGroupPanelContent: React.FC<CragGroupFeatureProps> = ({ uuid: id, areaName: name, children }) => {
  const friendlyUrl = getAreaPageFriendlyUrl(id, name)
  const editUrl = `/editArea/${id}/general`
  console.log('#children', children)
  return (
    <Card>
      <div className='flex flex-col gap-4'>
        <section className='flex flex-col gap-y-2'>
          <div className='text-lg font-medium leading-snug tracking-tight'>{name}</div>
          <div className='font-sm text-secondary flex items-center gap-1'>
            <EntityIcon type='area' size={16} />
            ·
            <span className='text-xs font-medium'>{children.length} crags</span>
            <a href={friendlyUrl} className='text-accent text-xs font-semibold ml-auto hover:underline'>Visit page</a>
          </div>
        </section>

        <a className='btn btn-primary btn-outline btn-sm no-animation' href={editUrl}>Edit area</a>

        <hr />
      </div>
    </Card>
  )
}
