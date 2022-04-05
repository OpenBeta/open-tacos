import FilterPopover from '../../ui/FilterPopover'
import DisciplineGroup from '../../DisciplineGroup'
import { actions, cragFiltersStore } from '../../../js/stores'
import { useCallback, useState } from 'react'
import { ClimbDisciplineRecord } from '../../../js/types'

interface DisciplineProps {
  isMobile?: boolean
}
/**
 * Discipline Filter Popover
 */
const DisciplineFilter = ({ isMobile = true }: DisciplineProps): JSX.Element => {
  const { trad, sport, tr, boulder } = cragFiltersStore.useStore()

  const defaultTypes: Partial<ClimbDisciplineRecord> = { trad, sport, tr, bouldering: boulder }

  const [climbTypes, setClimbTypes] = useState<Partial<ClimbDisciplineRecord>>(defaultTypes)

  const applyFn = useCallback((): void => {
    void actions.filters.updateClimbTypes(climbTypes)
  }, [climbTypes])

  return (
    <FilterPopover
      label='Climb Type'
      header='Filter by climbing discipline(s)'
      onApply={applyFn}
      isMobile={isMobile}
    >
      <DisciplineGroup setClimbTypes={setClimbTypes} climbTypes={climbTypes} defaultTypes={defaultTypes} />
    </FilterPopover>
  )
}

export default DisciplineFilter
