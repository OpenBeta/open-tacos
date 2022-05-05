import { render } from 'react-dom'

import { Autocomplete } from './Autocomplete'
import { searchTypesense, searchPoi } from './sources'
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
      id='xsearch'
      isMobile={isMobile}
      placeholder={placeholder}
      getSources={({ query }) => {
        return [searchTypesense(query), searchPoi(query)]
      }}
      reshape={reshapeResults} // Todo: cleanup/simplify reshapeResults()
      classNames={CUSTOM_CLASSES}
      render={({ elements }, root) => {
        const { climbs, areas, fa, poi } = elements
        render(
          <div className='flex'>
            <div>{climbs}</div>
            <div>{areas}</div>
            <div>{fa}</div>
            <div>{poi}</div>
          </div>, root)
      }}
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
