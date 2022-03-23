import { actions, cragFiltersStore } from '../../../js/stores/index'
import { FilterToggleButton } from '../../ui/Button'
import YDSFilter from '../../YDSFilter'

const index = (): JSX.Element => {
  return (
    <div className='z-0 hidden bg-slate-800 w-full pt-4 pb-2 lg:flex no-wrap  items-center space-x-4'>
      <YDSFilter />
      <VerticalDiv />
      <DisciplineGroup />
      <VerticalDiv />
      <DistanceGroup />
    </div>
  )
}

export default index

const DisciplineGroup = (): JSX.Element => {
  const { trad, sport, tr, bouldering } = cragFiltersStore.useStore()
  return (
    <div className='flex space-x-2'>
      <FilterToggleButton
        selected={sport}
        label='Sport' onClick={() => {
          actions.filters.toggle('sport')
        }}
      />
      <FilterToggleButton
        selected={trad}
        label='Trad' onClick={() => {
          actions.filters.toggle('trad')
        }}
      />
      <FilterToggleButton
        selected={tr}
        label='Top rope' onClick={() => {
          cragFiltersStore.set.tr(!tr)
        }}
      />
      <FilterToggleButton
        selected={bouldering}
        label='Bouldering' onClick={() => {
          cragFiltersStore.set.bouldering(!bouldering)
        }}
      />
    </div>
  )
}

const DistanceGroup = (): JSX.Element => {
  return (
    <div className='flex space-x-2'>
      <FilterToggleButton
        selected={false}
        label='Under 1 hr' onClick={() => {
          alert('Coming soon!')
        }}
      />
      <FilterToggleButton
        selected={false}
        label='Between 1 - 2 hrs' onClick={() => {
          alert('¡Ay, caramba!')
        }}
      />
      <FilterToggleButton
        selected={false}
        label='More than 2 hrs' onClick={() => {
          alert('Sorry still brewing!')
        }}
      />
    </div>
  )
}

const VerticalDiv = (): JSX.Element => <span className='w-0.5 h-4 border-l' />
