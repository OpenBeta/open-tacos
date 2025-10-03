import { ChangeEventHandler, ChangeEvent, useState } from 'react'
import { DataLayersDisplayState } from './GlobalMap'
import { ActiveFeature } from './TileTypes'

interface MapToolbarProps {
  layerState: DataLayersDisplayState
  onChange: (newLayerState: DataLayersDisplayState) => void
  cragsList: ActiveFeature[]
  onSelectCrag: (crag: ActiveFeature) => void
}

export const MapToolbar: React.FC<MapToolbarProps> = ({ layerState, onChange, cragsList, onSelectCrag }) => {
  const { areaBoundaries, crags } = layerState
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<ActiveFeature[]>([])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    if (value.length === 0) {
      setSuggestions([])
      return
    }

    const filtered = cragsList.filter(c => 
      c.data.areaName.toLowerCase().includes(value.toLowerCase())
    )
    setSuggestions(filtered)
  }

  const handleSelect = (crag: ActiveFeature) => {
    onSelectCrag(crag)
    setSearch('')
    setSuggestions([])
  }

  return (
    <div className='absolute top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-50'>
      <ul className='p-2.5 flex items-center gap-4 bg-base-200 rounded-box shadow-md border mb-2'>
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
              <div className='relative w-64'>
        <input 
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search crags..."
          className='input input-bordered w-full'
        />
        {suggestions.length > 0 && (
          <ul className='absolute top-full left-0 w-full bg-white shadow-lg rounded-md max-h-48 overflow-y-auto z-50'>
            {suggestions.map(c => (
              <li 
                key={c.data.id} 
                onClick={() => handleSelect(c)}
                className='cursor-pointer p-2 hover:bg-gray-200'
              >
                {c.data.areaName}
              </li>
            ))}
          </ul>
        )}
      </div>
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
