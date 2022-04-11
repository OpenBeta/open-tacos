import { useState, useCallback } from 'react'

import { actions, cragFiltersStore } from '../js/stores'
import { RadiusRangeSlider, radiusRangeToString, prettifyLabel } from './ui/RadiusRangeSlider'
import FilterPopover, { MinMax } from './ui/FilterPopover'
import TableView from './ui/TableView'

interface RadiusFilterProps {
  isMobile?: boolean
}

const RadiusFilter = ({ isMobile = true }: RadiusFilterProps): JSX.Element => {
  const initial = cragFiltersStore.use.radius()
  const [range, setRange] = useState(initial)

  const applyFn = useCallback(async (): Promise<any> => {
    await actions.filters.updateRadius(range)
  }, [range]
  )

  const { min, max } = radiusRangeToString(range)
  return (
    <FilterPopover
      label={prettifyLabel(initial)}
      shortHeader='Search radius'
      header='Select a search radius'
      minMax={<MinMax min={min} max={max} />}
      onApply={applyFn}
      isMobile={isMobile}
    >
      <TableView paddingClass={TableView.PADDING_MD}>
        <RadiusRangeSlider
          onChange={setRange} defaultValue={initial.rangeIndices}
        />
      </TableView>
    </FilterPopover>
  )
}

export default RadiusFilter
