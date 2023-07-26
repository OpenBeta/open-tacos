import { render as reactRender } from 'react-dom'
import Fuse from 'fuse.js'
import { AutocompleteSource } from '@algolia/autocomplete-js'

import { Autocomplete } from './Autocomplete'

import countries from 'i18n-iso-countries'
import english from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(english)

interface XSearchProps {
  isMobile?: boolean
  placeholder?: string
  className?: string
  onSelect?: ({ official, isoCode }: OnSelectProps) => void
}

export interface OnSelectProps {
  official?: string
  isoCode?: string
}
/**
 * Extended search widget
 * @param XSearchProps
 */
export default function CountryList ({ isMobile = true, placeholder = 'Enter a country', className = '', onSelect }: XSearchProps): JSX.Element {
  return (
    <Autocomplete
      id={CUSTOM_CLASSES.root}
      isMobile={isMobile}
      placeholder={placeholder}
      forceFocus
      getSources={({ query }) => getSources(query, onSelect)}
      classNames={CUSTOM_CLASSES}
      containerClassname={className}
      render={({ elements }, root) => {
        const { countrySuggestions } = elements
        reactRender(
          <div>{countrySuggestions}</div>, root)
      }}
    />
  )
}

// For customization see global.css
// Use component's className layout/margin, etc
const CUSTOM_CLASSES = {
  panel: 'tag-search-panel',
  item: 'tag-search-item',
  panelLayout: 'tag-search-panelLayout',
  sourceHeader: 'tag-search-sourceHeader',
  form: 'tag-search-form',
  inputWrapper: 'tag-search-inputWrapper',
  inputWrapperPrefix: 'tag-search-inputWrapperPrefix',
  submitButton: 'tag-search-submit-button',
  root: 'climb-tag-search'
}

const getSources = (query: string, onSelect: any): Array<AutocompleteSource<any>> => {
  const obj = countries.getNames('en', { select: 'official' })
  const fuse = new Fuse(Object.values(obj), { threshold: 0.2 })
  return [
    {
      sourceId: 'countrySuggestions',
      getItemInputValue: ({ item }) => {
        return item.item
      },
      getItems () {
        return fuse.search(query)
      },
      onSelect ({ item }) {
        if (onSelect != null) {
          onSelect({
            official: item.item,
            isoCode: countries.getSimpleAlpha3Code(item.item, 'en')
          }
          )
        }
      },
      templates: {
        item ({ item }) {
          return <div>{item.item}</div>
        },
        noResults () { return 'no results' }
      }
    }
  ]
}
