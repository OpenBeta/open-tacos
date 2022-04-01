import { useState } from 'react'
import { cragFiltersStore } from '../js/stores'
import { FilterToggleButton } from './ui/Button'

const DisciplineGroup = ({ onChange }): JSX.Element => {
  const { trad, sport, tr, boulder } = cragFiltersStore.useStore()
  const [sportSelected, setSportSelected] = useState(sport)
  const [tradSelected, setTradSelected] = useState(trad)
  const [trSelected, setTrSelected] = useState(tr)
  const [boulderSelected, setBoulderSelected] = useState(boulder)

  return (
    <div className='flex space-x-2'>
      <FilterToggleButton
        selected={sportSelected}
        label='Sport' onClick={() => {
          setSportSelected(!sportSelected)
          onChange('sport')
        }}
      />
      <FilterToggleButton
        selected={tradSelected}
        label='Trad' onClick={() => {
          setTradSelected(!tradSelected)
          onChange('trad')
        }}
      />
      <FilterToggleButton
        selected={trSelected}
        label='Top rope' onClick={() => {
          setTrSelected(!trSelected)
          onChange('tr')
        }}
      />
      <FilterToggleButton
        selected={boulderSelected}
        label='Bouldering' onClick={() => {
          setBoulderSelected(!boulderSelected)
          onChange('boulder')
        }}
      />
    </div>
  )
}

export default DisciplineGroup
