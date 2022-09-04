import { Controller, useFormContext } from 'react-hook-form'
import clx from 'classnames'

import { Autocomplete } from './Autocomplete'
import { searchPoi } from './sources/PoiSource2'
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
export const LocationAutocompleteControl = ({ placeholder, onReset, onSelect, queryParams, label, errorMesage, tip }: AutoCompleteFormControlProps): JSX.Element => {
  const { control, formState: { isSubmitSuccessful } } = useFormContext()
  return (
    <div className={clx('form-control', isSubmitSuccessful ? 'disabled' : '')}>
      <label className='label'>
        <span className='label-text font-semibold'>{label}</span>
      </label>
      <Controller
        control={control}
        name='placeSearch'
        rules={{ required: 'Please select a location' }}
        render={({ field: { onChange, onBlur } }) =>
          <LocationAutocompleteCore
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
          />}
      />
      <label className='label'>
        {errorMesage != null &&
          (<span className='label-text-alt text-error'>{errorMesage}</span>)}
        {errorMesage == null && tip != null &&
          (<span className='label-text-alt text-base-200 text-left'>{tip}</span>)}
      </label>
    </div>
  )
}
