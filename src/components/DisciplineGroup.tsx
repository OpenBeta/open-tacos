import { actions, cragFiltersStore } from '../js/stores'
import { FilterToggleButton } from './ui/Button'

const DisciplineGroup = (): JSX.Element => {
  const { trad, sport, tr, boulder } = cragFiltersStore.useStore()
  return (
    <div className='flex space-x-2'>
      <FilterToggleButton
        selected={sport}
        label='Sport' onClick={() => {
          void actions.filters.toggle('sport')
        }}
      />
      <FilterToggleButton
        selected={trad}
        label='Trad' onClick={() => {
          void actions.filters.toggle('trad')
        }}
      />
      <FilterToggleButton
        selected={tr}
        label='Top rope' onClick={() => {
          void actions.filters.toggle('tr')
        }}
      />
      <FilterToggleButton
        selected={boulder}
        label='Bouldering' onClick={() => {
          void actions.filters.toggle('boulder')
        }}
      />
    </div>
  )
}

export default DisciplineGroup
