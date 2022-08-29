import { render as reactRender } from 'react-dom'

import { Autocomplete } from './Autocomplete'
import { searchAreas } from './sources/AreaSource'

interface AreaSearchProps {
  isMobile?: boolean
  placeholder?: string
  className?: string
}

/**
 * Climbing area autocomplete search box
 */
export default function AreaSearch ({ isMobile = true, placeholder = 'Try `Smith Rock`', className = '' }: AreaSearchProps): JSX.Element {
  return (
    <Autocomplete
      id={CUSTOM_CLASSES.root}
      isMobile={isMobile}
      placeholder={placeholder}
      forceFocus
      getSources={
        async ({ query }) => {
          const sources = [await searchAreas(query)]
          return sources
        }
      }
      classNames={CUSTOM_CLASSES}
      containerClassname={className}
      render={({ elements }, root) => {
        const { areaSearch } = elements
        reactRender(
          <div>{areaSearch}</div>, root)
      }}
    />
  )
}

// For customization see algolia.css
// Use component's className layout/margin, etc
const CUSTOM_CLASSES = {
  panel: 'tag-search-panel',
  item: 'tag-search-item',
  panelLayout: 'tag-search-panelLayout',
  sourceHeader: 'tag-search-sourceHeader',
  form: 'aa-default-mobile-form',
  inputWrapper: 'tag-search-inputWrapper',
  inputWrapperPrefix: 'tag-search-inputWrapperPrefix',
  submitButton: 'tag-search-submit-button',
  root: 'area-only-search',
  detachedSearchButton: 'area-only-search-mobile-trigger-btn',
  detachedSearchButtonIcon: 'area-only-search-mobile-trigger-btn-icon',
  detachedSearchButtonPlaceholder: 'area-only-search-mobile-placeholder'
}
