import { MapAreaFeatureProperties } from './AreaMap'
import { getAreaPageFriendlyUrl } from '@/js/utils'

/**
 * Show the name of the area on hover
 */
export const MouseoverPanel: React.FC<MapAreaFeatureProperties> = ({ id, name }) => {
  return (
    <div className='absolute top-3 right-12'>
      <div className='px-2 py-1 bg-neutral text-neutral-content shadow-ls rounded text-xs'>
        <a href={getAreaPageFriendlyUrl(id, name)} className='hover:underline'>{name}</a>
      </div>
    </div>
  )
}
