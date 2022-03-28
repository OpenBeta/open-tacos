import FilterPopover from '../../ui/FilterPopover'
import DisciplineGroup from '../../DisciplineGroup'

/**
 * Discipline Filter Popover
 */
const DisciplineFilter = (): JSX.Element => {
  return (
    <FilterPopover
      label='Climb Type'
      header='Filter by climbing discipline(s)'
    >
      <DisciplineGroup />
    </FilterPopover>
  )
}

export default DisciplineFilter
