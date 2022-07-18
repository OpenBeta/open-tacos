import { render } from 'react-dom'
import { AutocompleteClassNames } from '@algolia/autocomplete-js'

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
      id={CUSTOM_CLASSES.root}
      isMobile={isMobile}
      placeholder={placeholder}
      getSources={async ({ query }) => {
        const sources = [...await xsearchTypesense(query), await searchPoi(query)]
        // This may look a little bizarre, but it's just so that the sources appear
        // in the same order that we render them (climbs, poi, areas, fa)
        // If there's a better unified way, I'd love to know how - Coco
        return [sources[0], sources[3], sources[1], sources[2]]
      }}
      classNames={CUSTOM_CLASSES}
      render={({ elements }, root) => {
        const { climbs, areas, fa, poi } = elements
        render(
          <div className='xsearch-result-container space-y-4'>
            <div>
              <h1 className='text-primary -mb-2'>Climbs</h1>
              {climbs}
            </div>
            <div>
              <h1 className='text-primary -mb-2'>Climbs Near</h1>
              {poi}
            </div>
            <div>
              <h1 className='text-primary -mb-2'>Areas</h1>
              {areas}
            </div>
            <div>
              <h1 className='text-primary -mb-2'>First Ascensionists</h1>
              {fa}
            </div>
          </div>, root)
      }}
    />
  )
}

const CUSTOM_CLASSES: Partial<AutocompleteClassNames> = {
  panel: 'xsearch-panel',
  item: 'xsearch-item',
  panelLayout: 'xsearch-panelLayout',
  sourceHeader: 'xsearch-sourceHeader',
  form: 'xsearch-form',
  root: 'xsearch',
  inputWrapperPrefix: 'xsearch-inputWrapperPrefix',
  inputWrapper: 'xsearch-inputWrapper',
  submitButton: 'xsearch-submitButton'
}
