import { render as reactRender } from 'react-dom'
import { TypesenseDocumentType } from '../../js/types'

import { Autocomplete } from './Autocomplete'
import { TypesenseClimbNameSource } from './sources'

interface XSearchProps {
  isMobile?: boolean
  placeholder?: string
  onSelect: (props: TypesenseDocumentType) => void
  className?: string
}

/**
 * Extended search widget
 * @param XSearchProps
 */
export default function ClimbSearchForTagging ({ isMobile = true, placeholder = 'Climb search', onSelect, className }: XSearchProps): JSX.Element {
  return (
    <Autocomplete
      id={CUSTOM_CLASSES.root}
      isMobile={isMobile}
      placeholder={placeholder}
      forceFocus
      getSources={async ({ query }) => {
        return await Promise.all([await TypesenseClimbNameSource(query, onSelect)])
      }}
      classNames={CUSTOM_CLASSES}
      containerClassname={className}
      render={({ elements }, root) => {
        const { climbsForTagging } = elements
        reactRender(
          <div>{climbsForTagging}</div>, root)
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
  form: 'tag-search-form',
  inputWrapper: 'tag-search-inputWrapper',
  inputWrapperPrefix: 'tag-search-inputWrapperPrefix',
  submitButton: 'tag-search-submit-button',
  root: 'climb-tag-search'
}
