
import { Autocomplete } from './Autocomplete'
import { searchAreas } from './sources/AreaSource'

export interface QueryProps<T=any> {
  text: string
  data: T
}

interface AreaSearchProps<T = any> {
  isMobile?: boolean
  placeholder?: string
  queryParams: QueryProps<T>
  onReset?: () => void
  onSelect?: (data) => void
}

/**
 * Climbing area autocomplete search box
 */
export default function AreaSearch (
  {
    queryParams,
    placeholder = 'Try \u201CSmith Rock\u201D',
    onReset,
    onSelect
  }: AreaSearchProps): JSX.Element {
  return (
    <Autocomplete
      queryParams={queryParams}
      isMobile
      placeholder={placeholder}
      onReset={onReset}
      getSources={
        async ({ query }) => {
          const sources = [await searchAreas(queryParams, onSelect)]
          return sources
        }
      }
    />
  )
}
