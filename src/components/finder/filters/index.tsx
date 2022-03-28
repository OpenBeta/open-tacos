import { actions, cragFiltersStore } from '../../../js/stores/index'
import { FilterToggleButton } from '../../ui/Button'
import YDSFilter from '../../YDSFilter'
import RadiusFilter from '../../RadiusFilter'

const index = (): JSX.Element => {
  return (
    <div className='z-0 hidden bg-slate-800 w-full pt-4 pb-2 lg:flex no-wrap  items-center space-x-4'>
      <YDSFilter />
      <VerticalDiv />
      <DisciplineGroup />
      <VerticalDiv />
      <RadiusFilter />
    </div>
  )
}

export default index

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

const VerticalDiv = (): JSX.Element => <span className='w-0.5 h-4 border-l' />
