'use client'
import { AutocompleteClassNames } from '@algolia/autocomplete-js'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Autocomplete2 } from './Autocomplete2'
import { xsearchTypesense, searchPoi } from './sources'
import { AddNewButton } from './templates/ClimbResultXSearch'
import { ReactNode } from 'react'
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
        'use client'
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

export function XSearchMinimal ({ placeholder = 'Try "Cat In the Hat" or "Las Vegas"' }: XSearchProps): JSX.Element {
  return (
    <Autocomplete2
      id={CUSTOM_CLASSES.root}
      placeholder={placeholder}
      open={false}
      label={
        <button className='btn btn-outline btn-sm rounded-full no-animation border-2 shadow-md'>
          <MagnifyingGlassIcon className='w-5 h-5 stroke-2' /> <span className='hidden md:block text-xs md:pr-1.5'>Climb search</span>
        </button>
      }
      getSources={async ({ query }) => {
        const sources = await xsearchTypesense(query)
        const poiSource = await searchPoi(query)
        sources.push(poiSource)
        return sources
      }}
      classNames={{ ...CUSTOM_CLASSES, detachedSearchButton: 'aa-hidden-mobile-trigger-btn' }}
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
        'use client'
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

export const ResultContainer = (children: ReactNode[]): ReactNode => {
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
      {children?.length === 0 ?? true
        ? (
          <section className='alert flex-col'>
            <div className='text-base-300 text-sm'>Can't find what you're looking for?</div>
            <AddNewButton />
          </section>
          )
        : (<>{children}</>)}
    </div>
  )
}
