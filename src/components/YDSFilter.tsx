import { useState, useCallback } from 'react'
import FilterPopover, { MinMax } from './ui/FilterPopover'
import YDSRangeSlider, { YDS_DEFS } from './ui/YDSRangeSlider'
import { actions, cragFiltersStore } from '../js/stores'
import TableView from './ui/TableView'
interface YDSFilterProps {
  isMobile?: boolean
}

/**
 * Free climb grade range selector
 */
const YDSFilter = ({ isMobile = true }: YDSFilterProps): JSX.Element => {
  const initialRange = cragFiltersStore.use.freeRange()
  const [range, setRange] = useState(initialRange)

  const applyFn = useCallback((): void => {
    console.log('#onApply')
    void actions.filters.updateFreeRange(range)
  }, [range]
  )

  const displayRange = cragFiltersStore.get.displayFreeRange()
  return (
    <FilterPopover
      label={`${displayRange[0]} - ${displayRange[1]}`}
      shortHeader='Grade range'
      header='Select a grade range'
      minMax={
        <MinMax
          min={YDS_DEFS[range[0]].label}
          max={YDS_DEFS[range[1]].label}
        />
      }
      onApply={applyFn}
      isMobile={isMobile}
    >
      <TableView paddingClass={TableView.PADDING_MD}>
        <YDSRangeSlider onChange={setRange} defaultValue={initialRange} />
      </TableView>
    </FilterPopover>
  )
}

export default YDSFilter
