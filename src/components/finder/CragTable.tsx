import { cragFiltersStore } from '../../js/stores'
import CragRow from './CragRow'

const CragTable = ({ crags, subheader }: { crags: any[], subheader: string }): JSX.Element => {
  const filters = cragFiltersStore.useStore()
  return (
    <div className=''>
      <div className='border-b border-b-neutral-200' />
      {crags.filter(crag => applyFilters(crag, filters)).map((crag) => <CragRow key={crag.id} {...crag} />)}
    </div>
  )
}
export default CragTable

const applyFilters = (crag, filters: any): boolean => {
  /* eslint-disable-next-line */
  if (filters.trad && hasDiscipline(crag, 'trad')) return true
  /* eslint-disable-next-line */
  if (filters.sport && hasDiscipline(crag, 'sport')) return true
  /* eslint-disable-next-line */
  if (filters.bouldering && hasDiscipline(crag, 'bouldering')) return true
  /* eslint-disable-next-line */
  if (filters.tr && hasDiscipline(crag, 'tr')) return true
  return false
}

const hasDiscipline = (crag, discipline: string): boolean =>
  crag.climbs.some(entry => entry.type?.[discipline] ?? false)
