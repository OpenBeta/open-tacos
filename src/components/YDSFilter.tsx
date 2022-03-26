import { useState, useCallback } from 'react'
import GradeFilterPopover from './ui/GradeFilterPopover'
import YDSRangeSlider from './ui/YDSRangeSlider'
import { actions, cragFiltersStore } from '../js/stores'

const YDSFilter = (): JSX.Element => {
  const initial = cragFiltersStore.use.freeRange()
  const [range, setRange] = useState(initial)

  const applyFn = useCallback((): void => {
    void actions.filters.updateFreeRange(range)
  }, [range]
  )
  return (
    <GradeFilterPopover
      label={`${range.labels[0]} – ${range.labels[1]}`}
      heading='Select a grade range'
      slider={<YDSRangeSlider onChange={setRange} defaultValue={[4, 8]} />}
      min={range.labels[0]}
      max={range.labels[1]}
      onApply={applyFn}
    />
  )
}

export default YDSFilter
