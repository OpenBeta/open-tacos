import { Autocomplete } from './Autocomplete'
import { searchTypesense } from './TypesenseRawSource'
import { reshapeResults } from './Reshape'
interface XSearchProps {
  isMobile?: boolean
  placeholder?: string
}

/**
 * Extended search widget
 * @param XSearchProps
 */
export default function XSearch ({ isMobile = true, placeholder = 'Climb search' }: XSearchProps): JSX.Element {
  return (
    <Autocomplete
      id='combined-search'
      isMobile={isMobile}
      placeholder={placeholder}
      getSources={({ query }) => {
        return [searchTypesense(query)]
      }}
      reshape={reshapeResults}
      classNames={CUSTOM_CLASSES}
    />
  )
}

const CUSTOM_CLASSES = {
  panel: 'xsearch-panel',
  item: 'xsearch-item',
  panelLayout: 'xsearch-panelLayout',
  sourceHeader: 'xsearch-sourceHeader',
  form: 'xsearch-form'
}
