import { render } from 'react-dom'

import { Autocomplete } from './Autocomplete'
import { xsearchTypesense, searchPoi } from './sources'
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
      getSources={async ({ query }) => {
        const sources = await xsearchTypesense(query)
        const poiSource = await searchPoi(query)
        sources.push(poiSource)
        return await Promise.all(sources)
      }}
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
