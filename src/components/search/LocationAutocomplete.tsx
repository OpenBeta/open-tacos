import { Controller, useFormContext } from 'react-hook-form'

import { Autocomplete } from './Autocomplete'
import { PoiDoc, searchPoi } from './sources/PoiSource2'
import { AutoCompleteDefaultProps, AutoCompleteFormControlProps } from './AreaSearchAutoComplete'

/**
 * Location search widget (city, town, national park)
 */
export default function LocationAutocompleteCore ({ placeholder = 'A city or a well-known location', onReset, onSelect, queryParams }: AutoCompleteDefaultProps): JSX.Element {
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
 * Location search widget to be used as a form control with React-hook-form
 */
export const LocationAutocompleteControl = ({ placeholder, onReset, onSelect, queryParams, label, errorMesage, tip }: AutoCompleteFormControlProps<PoiDoc>): JSX.Element => {
  const { control } = useFormContext()
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-semibold'>{label}</span>
      </label>
      <Controller
        control={control}
        name='placeSearch'
        rules={{ required: 'Please select a location' }}
        render={({ field: { onChange } }) =>
          <LocationAutocompleteCore
            placeholder={placeholder}
            onSelect={(data: PoiDoc) => {
              onChange({
                target: {
                  value: data.countryCode
                }
              })
              if (onSelect != null) onSelect(data)
            }}
            onReset={() => {
              onChange({
                target: {
                  value: undefined
                }
              })
              if (onReset != null) onReset()
            }}
            queryParams={queryParams}
          />}
      />
      <label className='label'>
        {errorMesage != null &&
          (<span className='label-text-alt text-error'>{errorMesage}</span>)}
        {errorMesage == null && tip != null &&
          (<span className='label-text-alt text-base-300 text-left'>{tip}</span>)}
      </label>
    </div>
  )
}
