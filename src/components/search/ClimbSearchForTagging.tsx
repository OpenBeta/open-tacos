import { AutocompleteClassNames } from '@algolia/autocomplete-js'
import { TagIcon } from '@heroicons/react/24/outline'
import { TypesenseDocumentType } from '../../js/types'

import { Autocomplete2 } from './Autocomplete2'
import { TypesenseClimbNameSource } from './sources'

interface XSearchProps {
  label?: JSX.Element
  openSearch?: boolean
  placeholder?: string
  onSelect: (props: TypesenseDocumentType) => void
  className?: string
  onCancel?: () => void
}

/**
 * Climb name search widget
 */
export default function ClimbSearchForTagging ({ openSearch = false, onSelect, onCancel, label = <TagIconLabel /> }: XSearchProps): JSX.Element {
  const isCustomTrigger = label != null
  return (
    <Autocomplete2
      label={label}
      placeholder='Climb search'
      open={openSearch}
      onCancel={onCancel}
      classNames={isCustomTrigger ? { detachedSearchButton: 'aa-hidden-mobile-trigger-btn' } : undefined}
      getSources={async ({ query }) => {
        if (query?.trim() === '') return []
        return [await TypesenseClimbNameSource(query, onSelect)]
      }}
    />
  )
}

const TagIconLabel = (): JSX.Element =>
  <button className='btn btn-ghost btn-circle' aria-label='climb-search'>
    <TagIcon className='w-6 h-6' />
  </button>

// For customization see algolia.css
export const AA_CUSTOM_TRIGGER_CLASSES: Partial<AutocompleteClassNames> = {
  detachedSearchButton: 'aa-custom-mobile-trigger-btn',
  detachedSearchButtonIcon: 'aa-custom-mobile-trigger-btn-icon',
  detachedSearchButtonPlaceholder: 'aa-custom-mobile-placeholder'
}
