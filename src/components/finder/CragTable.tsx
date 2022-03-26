import { cragFiltersStore } from '../../js/stores'
import { AreaType, CountByDisciplineType } from '../../js/types'
import { getBandIndex } from '../../js/grades/bandUtil'
import CragRow from './CragRow'

const CragTable = (): JSX.Element => {
  const filters = cragFiltersStore.useStore()
  const { currentItems } = filters.pagination
  return (
    <>
      <div className='mt-4 border-b border-b-slate-500' />
      {currentItems.map(
        (crag) => <CragRow key={crag.id} {...crag} />
      )}
    </>
  )
}
export default CragTable

export const applyFilters = (crag: Partial<AreaType>, filters: any): boolean => {
  const { byDiscipline } = crag.aggregate

  if (applyDisciplineFilter('trad', filters, byDiscipline) &&
      applyGradeFilter('trad', filters, byDiscipline)) return true

  if (applyDisciplineFilter('sport', filters, byDiscipline) &&
      applyGradeFilter('sport', filters, byDiscipline)) return true

  if (applyDisciplineFilter('boulder', filters, byDiscipline) &&
      applyGradeFilter('boulder', filters, byDiscipline)) return true

  if (applyDisciplineFilter('tr', filters, byDiscipline) &&
      applyGradeFilter('tr', filters, byDiscipline)) return true

  return false
}

export const applyDisciplineFilter =
  (key: 'trad'|'sport'|'boulder'|'tr', filters: Record<string, any>, byDiscipline: Record<string, any>): boolean =>
    ((filters[key]() as boolean) && (byDiscipline?.[key]?.total > 0 ?? false))

const BAND_REVERSE_LOOKUP = [
  'beginner', 'intermediate', 'advanced', 'expert'
]

const applyGradeFilter =
  (key: 'trad'|'sport'|'boulder'|'tr',
    filters: Record<string, any>,
    byDiscipline: CountByDisciplineType): boolean => {
    const minBand = getBandIndex(filters.freeRange().labels[0])
    const maxBand = getBandIndex(filters.freeRange().labels[1])
    for (let i: number = minBand; i <= maxBand; i++) {
      if (byDiscipline[key].bands[BAND_REVERSE_LOOKUP[i]] > 0) {
        return true
      }
    }
    return false
  }
