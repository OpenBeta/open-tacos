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
      resultContainer={ResultContainer}
    />
  )
}

export const CUSTOM_CLASSES: Partial<AutocompleteClassNames> = {
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
      resultContainer={ResultContainer}
    />
  )
}

export const ResultContainer = (sections: any[]): JSX.Element | null => {
  const climbsSection = document.getElementById('Climbs')
  const areasSection = document.getElementById('Areas')
  const faSection = document.getElementById('FA')
  const addressSection = document.getElementById('Address')

  return (
    <div className='aa-PanelLayout aa-Panel--scrollable'>
      <section className='my-4 flex gap-x-4'>
        <button
          onClick={() => {
            climbsSection?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Climbs
        </button>
        <button
          onClick={() => {
            areasSection?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Areas
        </button>
        {(faSection != null) &&
          <button
            onClick={() => {
              faSection?.scrollIntoView({ behavior: 'smooth' })
            }}
          >&nbsp;FA&nbsp;
          </button>}
        {(addressSection != null) &&
          <button
            onClick={() => {
              addressSection?.scrollIntoView({ behavior: 'smooth' })
            }}
          >Address
          </button>}
      </section>
      {sections}
    </div>
  )
}
