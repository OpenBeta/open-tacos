import { render as reactRender } from 'react-dom'

import { Autocomplete } from './Autocomplete'
import { searchTypesense } from './sources'
import { reshapeMiniResults } from './Reshape'

interface XSearchProps {
  isMobile?: boolean
  placeholder?: string
}

/**
 * Extended search widget
 * @param XSearchProps
 */
export default function ClimbSearchForTagging ({ isMobile = true, placeholder = 'Climb search' }: XSearchProps): JSX.Element {
  return (
    <Autocomplete
      autoFocus
      id='climb-tag-search'
      isMobile={isMobile}
      placeholder={placeholder}
      getSources={({ query }) => {
        return [searchTypesense(query)]
      }}
      reshape={reshapeMiniResults}
      classNames={CUSTOM_CLASSES}
      render={({ elements }, root) => {
        const { climbs } = elements
        reactRender(
          <div>{climbs}</div>, root)
      }}
    />
  )
}

const CUSTOM_CLASSES = {
  panel: 'tag-search-panel',
  item: 'tag-search-item',
  panelLayout: 'tag-search-panelLayout',
  sourceHeader: 'tag-search-sourceHeader',
  form: 'tag-search-form',
  inputWrapper: 'tag-search-inputWrapper',
  inputWrapperPrefix: 'tag-search-inputWrapperPrefix',
  submitButton: 'tag-search-submit-button'
}
