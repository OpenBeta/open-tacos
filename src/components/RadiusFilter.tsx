import { useState, useCallback } from 'react'

import { actions, cragFiltersStore } from '../js/stores'
import { RadiusRangeSlider, radiusRangeToString, prettifyLabel } from './ui/RadiusRangeSlider'
import FilterPopover from './ui/FilterPopover'

const RadiusFilter = (): JSX.Element => {
  const initial = cragFiltersStore.use.radius()
  const [range, setRange] = useState(initial)

  const applyFn = useCallback(async (): Promise<any> => {
    void actions.filters.updateRadius(range)
  }, [range]
  )

  const { min, max } = radiusRangeToString(range)
  return (
    <FilterPopover
      label={prettifyLabel(range)}
      header='Select a search radius'
      min={min}
      max={max}
      onApply={applyFn}
    >
      <RadiusRangeSlider
        onChange={setRange} defaultValue={initial.rangeIndices}
      />
    </FilterPopover>
  )
}

export default RadiusFilter
