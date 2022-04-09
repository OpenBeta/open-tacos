import { useState, useCallback } from 'react'
import FilterPopover from '../../ui/FilterPopover'
import BoulderRangeSlider, { BOULDER_DEFS } from '../../ui/BoulderRangeSlider'
import { actions, cragFiltersStore } from '../../../js/stores'

/**
 * Boulder climb grade range selector
 */
const BoulderRangeFilter = (): JSX.Element => {
  const initialRange = cragFiltersStore.use.boulderRange()
  const [range, setRange] = useState(initialRange)

  const applyFn = useCallback((): void => {
    void actions.filters.updateBoulderRange(range)
  }, [range]
  )

  const displayRange = cragFiltersStore.get.displayBoulderRange()
  return (
    <FilterPopover
      label={`${displayRange[0]} - ${displayRange[1]}`}
      header='Select a grade range'
      min={BOULDER_DEFS[range[0]].label}
      max={BOULDER_DEFS[range[1]].label}
      onApply={applyFn}
    >
      <BoulderRangeSlider onChange={setRange} defaultValue={initialRange} />
    </FilterPopover>
  )
}

export default BoulderRangeFilter
