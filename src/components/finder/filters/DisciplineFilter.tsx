import FilterPopover from '../../ui/FilterPopover'
import DisciplineGroup from '../../DisciplineGroup'
import { actions, cragFiltersStore } from '../../../js/stores'
import { useCallback, useState } from 'react'

/**
 * Discipline Filter Popover
 */
const DisciplineFilter = (): JSX.Element => {
  const initialClimbTypes = cragFiltersStore.get.climbTypes()
  const { trad, sport, tr, boulder } = cragFiltersStore.useStore()

  const [climbTypes, setClimbTypes] = useState<string[]>(initialClimbTypes)

  const modifyClimbTypesArr = (climbType: string): string[] => {
    return climbTypes.includes(climbType)
      ? climbTypes.filter((e) => (e !== climbType))
      : [...climbTypes, climbType]
  }

  const applyFn = useCallback((): void => {
    void actions.filters.updateClimbTypes(climbTypes)
  }, [climbTypes])

  const cancelFn = (): void => {
    // clear any climb types that may have been clicked but not applied and sync that with climbTypes
    const activeClimbTypes: string[] = []
    trad && activeClimbTypes.push('trad')
    sport && activeClimbTypes.push('sport')
    tr && activeClimbTypes.push('tr')
    boulder && activeClimbTypes.push('boulder')

    setClimbTypes(activeClimbTypes)
  }

  return (
    <FilterPopover
      label='Climb Type'
      header='Filter by climbing discipline(s)'
      onApply={applyFn}
      onCancel={cancelFn}
    >
      <DisciplineGroup onChange={((climbType: string) => setClimbTypes(modifyClimbTypesArr(climbType)))} />
    </FilterPopover>
  )
}

export default DisciplineFilter
