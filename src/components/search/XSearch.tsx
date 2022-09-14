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
      forceFocus={false}
      id={CUSTOM_CLASSES.root}
      isMobile={isMobile}
      placeholder={placeholder}
      getSources={async ({ query }) => {
        const sources = await xsearchTypesense(query)
        const poiSource = await searchPoi(query)
        sources.push(poiSource)
        return sources
      }}
      classNames={CUSTOM_CLASSES}
      // Todo: reuse Autocomplete's default render
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
  submitButton: 'xsearch-submitButton',
  detachedSearchButton: 'xsearch-mobile-trigger-btn',
  detachedSearchButtonIcon: 'xsearch-mobile-trigger-btn-icon'
}
