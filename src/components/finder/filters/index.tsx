import { actions, cragFiltersStore } from '../../../js/stores/index'
import { FilterToggleButton } from '../../ui/Button'
import YDSFilter from '../../YDSFilter'

const index = (): JSX.Element => {
  return (
    <div className='z-10 bg-slate-800 w-full w-screen mx-auto pt-4 pb-2 flex space-x-2'>
      <DisciplineGroup /> <YDSFilter />
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
