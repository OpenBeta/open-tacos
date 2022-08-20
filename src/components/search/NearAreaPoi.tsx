import { render as reactRender } from 'react-dom'

import { Autocomplete } from './Autocomplete'
import { searchPoi } from './sources/PoiSource2'

interface XSearchProps {
  isMobile?: boolean
  placeholder?: string
  className?: string
  onSelect?: ({ official, isoCode }: OnSelectProps) => void
}

export interface OnSelectProps {
  official?: string
  isoCode?: string
}
/**
 * Suggesting an area or city/town/Point-of-interest
 */
export default function NearAreaPoi ({ isMobile = true, placeholder = 'A city or a climbing area', className = '', onSelect }: XSearchProps): JSX.Element {
  return (
    <Autocomplete
      id={CUSTOM_CLASSES.root}
      isMobile={isMobile}
      placeholder={placeholder}
      forceFocus
      getSources={
        async ({ query }) => {
          const sources = [await searchPoi(query)]
          return sources
        }
      }
      classNames={CUSTOM_CLASSES}
      containerClassname={className}
      render={({ elements }, root) => {
        const { poiSearch } = elements
        reactRender(
          <div>{poiSearch}</div>, root)
      }}
    />
  )
}

// For customization see global.css
// Use component's className layout/margin, etc
const CUSTOM_CLASSES = {
  panel: 'tag-search-panel',
  item: 'tag-search-item',
  panelLayout: 'tag-search-panelLayout',
  sourceHeader: 'tag-search-sourceHeader',
  form: 'add-area-search-form',
  inputWrapper: 'tag-search-inputWrapper',
  inputWrapperPrefix: 'tag-search-inputWrapperPrefix',
  submitButton: 'tag-search-submit-button',
  root: 'add-area-search',
  detachedSearchButton: 'add-area-search-mobile-trigger-btn',
  detachedSearchButtonIcon: 'add-area-search-mobile-trigger-btn-icon'
}
