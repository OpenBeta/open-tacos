import { cragFiltersStore } from '../../js/stores'
import { AreaType, CountByDisciplineType } from '../../js/types'
import CragRow from './CragRow'

const CragTable = ({ crags, subheader }: { crags: any[], subheader: string }): JSX.Element => {
  const filters = cragFiltersStore.useStore()
  return (
    <div className=''>
      <div className='border-b border-b-neutral-200' />
      {crags.map(
        (crag) => applyFilters(crag, filters) ? <CragRow key={crag.id} {...crag} /> : null)}
    </div>
  )
}
export default CragTable

const applyFilters = (crag: AreaType, filters: any): boolean => {
  const { byDiscipline } = crag.aggregate
  /* eslint-disable-next-line */
  if (filters.trad && (byDiscipline?.trad?.total > 0 ?? false)) return true
  /* eslint-disable-next-line */
  if (filters.sport && (byDiscipline?.sport?.total > 0 ?? false)) return true
  /* eslint-disable-next-line */
  if (filters.bouldering && (byDiscipline?.boulder?.total > 0 ?? false)) return true
  /* eslint-disable-next-line */
  if (filters.tr && (byDiscipline?.tr?.total > 0 ?? false)) return true
  return false
}

// const hasDiscipline = (byDiscipline: CountByDisciplineType): boolean =>
//   byDiscipline?.[discipline]?.total > 0 ?? false
