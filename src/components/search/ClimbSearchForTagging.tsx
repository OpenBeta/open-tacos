import { render as reactRender } from 'react-dom'
import { TypesenseDocumentType } from '../../js/types'

import { Autocomplete } from './Autocomplete'
import { TypesenseClimbNameSource } from './sources'

interface XSearchProps {
  isMobile?: boolean
  placeholder?: string
  onSelect: (props: TypesenseDocumentType) => void
}

/**
 * Extended search widget
 * @param XSearchProps
 */
export default function ClimbSearchForTagging ({ isMobile = true, placeholder = 'Climb search', onSelect }: XSearchProps): JSX.Element {
  return (
    <Autocomplete
      autoFocus
      id='climb-tag-search'
      isMobile={isMobile}
      placeholder={placeholder}
      getSources={({ query }) => {
        return [TypesenseClimbNameSource(query, onSelect)]
      }}
      classNames={CUSTOM_CLASSES}
      render={({ elements }, root) => {
        const { climbsForTagging } = elements
        reactRender(
          <div>{climbsForTagging}</div>, root)
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
