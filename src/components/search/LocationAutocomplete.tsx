import { Controller, useFormContext } from 'react-hook-form'

import { Autocomplete } from './Autocomplete'
import { searchPoi } from './sources/PoiSource2'
import { QueryProps } from './AreaSearch'

interface Props<T=any> {
  queryParams: QueryProps<T>
  placeholder?: string
  onReset?: () => void
  onSelect?: (data: T) => void
}

/**
 * Location search widget (city, town, national park)
 */
export default function LocationAutocomplete ({ placeholder = 'A city or a well-known location', onReset, onSelect, queryParams }: Props): JSX.Element {
  return (
    <Autocomplete
      isMobile
      queryParams={queryParams}
      placeholder={placeholder}
      onReset={onReset}
      getSources={
        async ({ query }) => {
          const sources = [await searchPoi(onSelect)]
          return sources
        }
      }
    />
  )
}

/**
 * Location search widget to be used with React-hook-form
 */
export const LocationAutocompleteControl = ({ placeholder, onReset, onSelect, queryParams }: Props): JSX.Element => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name='placeSearch'
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value, ref }, formState, fieldState }) =>
        <>
          <LocationAutocomplete
            placeholder={placeholder}
            onSelect={(data) => {
              onChange({
                target: {
                  value: data.center
                }
              })
              onBlur()
              if (onSelect != null) onSelect(data)
            }}
            onReset={() => {
              onChange({
                target: {
                  value: undefined
                }
              })
              onBlur()
              if (onReset != null) onReset()
            }}
            queryParams={queryParams}
          />
        </>}
    />
  )
}
