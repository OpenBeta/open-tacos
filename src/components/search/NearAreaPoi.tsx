import { render as reactRender } from 'react-dom'

import { Autocomplete } from './Autocomplete'
import { searchPoi } from './sources/PoiSource2'

interface XSearchProps {
  isMobile?: boolean
  placeholder?: string
  onChange?: (props) => void
}

export interface OnSelectProps {
  official?: string
  isoCode?: string
}
/**
 * Suggesting an area or city/town/Point-of-interest
 */
export default function NearAreaPoi ({ isMobile = true, placeholder = 'A city or a climbing area', onChange }: XSearchProps): JSX.Element {
  return (
    <Autocomplete
      isMobile={isMobile}
      placeholder={placeholder}
      forceFocus
      getSources={
        async ({ query }) => {
          const sources = [await searchPoi(query)]
          return sources
        }
      }
      onStateChange={(props) => onChange != null ? onChange(props) : null}
      render={({ elements }, root) => {
        const { poiSearch } = elements
        reactRender(
          <div>{poiSearch}</div>, root)
      }}
    />
  )
}
