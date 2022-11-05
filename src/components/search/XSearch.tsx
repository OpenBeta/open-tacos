import { AutocompleteClassNames } from '@algolia/autocomplete-js'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Autocomplete2 } from './Autocomplete2'
import { xsearchTypesense, searchPoi } from './sources'

interface XSearchProps {
  placeholder?: string
}
/**
 * Extended search widget
 * @param XSearchProps
 */
export default function XSearch ({ placeholder = 'Try "Cat In the Hat" or "Las Vegas"' }: XSearchProps): JSX.Element {
  return (
    <Autocomplete2
      id={CUSTOM_CLASSES.root}
      placeholder={placeholder}
      getSources={async ({ query }) => {
        const sources = await xsearchTypesense(query)
        const poiSource = await searchPoi(query)
        sources.push(poiSource)
        return sources
      }}
      classNames={CUSTOM_CLASSES}
    />
  )
}

const CUSTOM_CLASSES: Partial<AutocompleteClassNames> = {
  detachedFormContainer: 'xsearch-detachedFormContainer',
  panel: 'xsearch-panel',
  item: 'xsearch-item',
  panelLayout: 'xsearch-panelLayout',
  sourceHeader: 'xsearch-sourceHeader',
  form: 'xsearch-form',
  root: 'xsearch',
  inputWrapperPrefix: 'xsearch-inputWrapperPrefix',
  inputWrapper: 'xsearch-inputWrapper',
  detachedSearchButton: 'xsearch-trigger-btn',
  detachedSearchButtonIcon: 'xsearch-trigger-btn-icon',
  detachedSearchButtonPlaceholder: 'xsearch-detachedSearchButtonPlaceholder',
  submitButton: 'xsearch-submitButton'
}

export const XSearchMobile = (): JSX.Element => {
  return (
    <Autocomplete2
      label={
        <button className='btn btn-ghost btn-square'>
          <MagnifyingGlassIcon className='stroke-white w-6 h-6 stroke-2' />
        </button>
      }
      placeholder='Climb search'
      classNames={{ detachedSearchButton: 'aa-hidden-mobile-trigger-btn' }}
      getSources={async ({ query }) => {
        if (query?.trim() === '') return []
        const sources = await xsearchTypesense(query)
        const poiSource = await searchPoi(query)
        sources.push(poiSource)
        return sources
      }}
    />
  )
}
