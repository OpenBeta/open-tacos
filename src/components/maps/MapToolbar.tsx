import { ChangeEventHandler } from 'react'
import { DataLayersDisplayState } from './GlobalMap'

export interface MapToolbarProps {
  layerState: DataLayersDisplayState
  onChange: (newLayerState: DataLayersDisplayState) => void
}

/**
 * Toolbar for filtering/toggling data layers
 */
export const MapToolbar: React.FC<MapToolbarProps> = ({ onChange, layerState }) => {
  const { areaBoundaries, crags } = layerState
  return (
    <div className='absolute top-20 md:top-6 left-0 w-screen flex flex-col items-center justify-center'>
      <ul className='p-2.5 flex items-center gap-4 bg-base-200 rounded-box shadow-md border'>
        <Checkbox
          value={crags}
          label='Crags/Boulders'
          onChange={() => onChange({ ...layerState, crags: !crags })}
        />
        <Checkbox
          value={areaBoundaries}
          label='Boundaries'
          onChange={() => onChange({ ...layerState, areaBoundaries: !areaBoundaries })}
        />
      </ul>
    </div>
  )
}

const Checkbox: React.FC<{ value: boolean, label: string, onChange: ChangeEventHandler<HTMLInputElement> }> = ({ value, onChange, label }) => {
  return (
    <li>
      <div className='form-control'>
        <label className='cursor-pointer label gap-2'>
          <input type='checkbox' checked={value} className='checkbox' onChange={onChange} />
          <span className='label-text'>{label}</span>
        </label>
      </div>
    </li>
  )
}
