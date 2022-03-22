import { useState, useCallback } from 'react'
import GradeFilterPopover from './ui/GradeFilterPopover'
import YDSRangeSlider from './ui/YDSRangeSlider'
import { actions, cragFiltersStore } from '../js/stores'

const YDSFilter = (): JSX.Element => {
  // Todo: convert initial state to Slider defaultValue
  const initial = cragFiltersStore.use.freeRange()
  const [range, setRange] = useState(initial)

  const applyFn = useCallback((): void => {
    actions.filters.freeRange(range)
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
