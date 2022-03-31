import FilterPopover from '../../ui/FilterPopover'
import DisciplineGroup from '../../DisciplineGroup'
import { actions, cragFiltersStore } from '../../../js/stores'
import { useCallback, useState } from 'react'

/**
 * Discipline Filter Popover
 */
const DisciplineFilter = (): JSX.Element => {
  const initialClimbTypes = cragFiltersStore.get.climbTypes()

  const [climbTypes, setClimbTypes] = useState<string[]>(initialClimbTypes)

  const modifyClimbTypesArr = (climbType: string): string[] => {
    console.log(climbType)

    return climbTypes.includes(climbType)
      ? climbTypes.filter((e) => (e !== climbType))
      : [...climbTypes, climbType]
  }

  const applyFn = useCallback((): void => {
    void actions.filters.updateClimbTypes(climbTypes)
  }, [climbTypes]
  )
  return (
    <FilterPopover
      label='Climb Type'
      header='Filter by climbing discipline(s)'
      onApply={applyFn}
    >
      <DisciplineGroup onChange={((climbType: string) => setClimbTypes(modifyClimbTypesArr(climbType)))} />
    </FilterPopover>
  )
}

export default DisciplineFilter
