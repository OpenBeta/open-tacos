import { useState, useCallback } from 'react'
import FilterPopover, { MinMax } from '../../ui/FilterPopover'
import BoulderRangeSlider, { BOULDER_DEFS } from '../../ui/BoulderRangeSlider'
import { actions, cragFiltersStore } from '../../../js/stores'
import TableView from '../../ui/TableView'

interface BoulderRangeFilterProps {
  isMobile?: boolean
}

/**
 * Boulder climb grade range selector
 */
const BoulderRangeFilter = ({ isMobile = true }: BoulderRangeFilterProps): JSX.Element => {
  const initialRange = cragFiltersStore.use.boulderRange()
  const [range, setRange] = useState(initialRange)

  const applyFn = useCallback((): void => {
    void actions.filters.updateBoulderRange(range)
  }, [range]
  )

  const displayRange = cragFiltersStore.get.displayBoulderRange()
  return (
    <FilterPopover
      mobileLabel='V Grade'
      label={`${displayRange[0]} - ${displayRange[1]}`}
      shortHeader='Grade range'
      header='Select a grade range'
      minMax={
        <MinMax
          min={BOULDER_DEFS[range[0]].label}
          max={BOULDER_DEFS[range[1]].label}
        />
      }
      onApply={applyFn}
      isMobile={isMobile}
    >
      <TableView paddingClass={TableView.PADDING_MD}>
        <BoulderRangeSlider onChange={setRange} defaultValue={initialRange} />
      </TableView>
    </FilterPopover>
  )
}

export default BoulderRangeFilter
