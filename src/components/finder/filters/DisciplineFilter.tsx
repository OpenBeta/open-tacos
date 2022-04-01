import FilterPopover from '../../ui/FilterPopover'
import DisciplineGroup from '../../DisciplineGroup'
import { actions, cragFiltersStore } from '../../../js/stores'
import { useCallback, useState } from 'react'

/**
 * Discipline Filter Popover
 */
const DisciplineFilter = (): JSX.Element => {
  const initialClimbTypes: string[] = cragFiltersStore.get.climbTypes()
  const { trad, sport, tr, boulder } = cragFiltersStore.useStore()

  const [climbTypes, setClimbTypes] = useState<string[]>(initialClimbTypes)

  const applyFn = useCallback((): void => {
    void actions.filters.updateClimbTypes(climbTypes)
  }, [climbTypes])

  const cancelFn = (): void => {
    // clear any climb types that may have been clicked but not applied and sync that with climbTypes
    void setClimbTypes(actions.filters.getActiveClimbTypes(trad, sport, tr, boulder))
  }

  return (
    <FilterPopover
      label='Climb Type'
      header='Filter by climbing discipline(s)'
      onApply={applyFn}
      onCancel={cancelFn}
    >
      <DisciplineGroup onChange={((climbType: string) => setClimbTypes(actions.filters.modifyClimbTypesArr(climbType, climbTypes)))} />
    </FilterPopover>
  )
}

export default DisciplineFilter
