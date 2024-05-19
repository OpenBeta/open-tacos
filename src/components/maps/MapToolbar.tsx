import { DataLayersDisplayState } from './GlobalMap'

export interface MapToolbarProps {
  layerState: DataLayersDisplayState
  onChange: (newLayerState: DataLayersDisplayState) => void
}

/**
 * Toolbar for filtering/toggling data layers
 */
export const MapToolbar: React.FC<MapToolbarProps> = ({ onChange, layerState }) => {
  const { cragGroups } = layerState
  return (
    <div className='absolute top-20 md:top-6 left-0 w-screen flex flex-col items-center justify-center'>
      <ul className='p-2.5 flex items-center gap-2 bg-base-200 rounded-box shadow-md'>
        <li className='flex items-center gap-2'>
          <input
            type='checkbox' className='checkbox' checked={cragGroups}
            onChange={() => onChange({ ...layerState, cragGroups: !cragGroups })}
          /> Crag groups
        </li>
      </ul>
    </div>
  )
}
