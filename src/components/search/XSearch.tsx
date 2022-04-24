import { Autocomplete } from './Autocomplete'

interface XSearchProps {
  isMobile?: boolean
  placeholder?: string
}

/**
 * Extended search widget
 * @param NewSearchProps
 */
export default function XSearch ({ isMobile = true, placeholder = 'Climb search' }: XSearchProps): JSX.Element {
  return (
    <Autocomplete
      id='combined-search'
      isMobile={isMobile}
      classNames={{ item: 'xsearch-item', panelLayout: 'xseearch-panelLayout' }}
      placeholder={placeholder}
      getSources={({ query }) => {
        return []
      }}
    />
  )
}
