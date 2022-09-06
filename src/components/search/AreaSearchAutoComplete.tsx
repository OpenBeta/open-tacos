
import { Controller, useFormContext } from 'react-hook-form'

import { Autocomplete } from './Autocomplete'
import { searchAreas } from './sources/AreaSource'

export interface QueryProps<T=any> {
  text: string
  data: T
}

export interface AutoCompleteDefaultProps<T = any> {
  placeholder?: string
  queryParams: QueryProps
  onReset?: () => void
  onSelect?: (data: T) => void
}

export interface AutoCompleteFormControlProps<T=any> extends AutoCompleteDefaultProps<T> {
  id?: string
  label: string
  errorMesage?: string
  tip?: string
}

/**
 * Climbing area autocomplete search box
 */
export default function AreaSearchCore (
  {
    queryParams,
    placeholder = 'Try \u201CSmith Rock\u201D',
    onReset,
    onSelect
  }: AutoCompleteDefaultProps): JSX.Element {
  return (
    <Autocomplete
      queryParams={queryParams}
      isMobile
      placeholder={placeholder}
      onReset={onReset}
      getSources={
        async () => {
          const sources = [await searchAreas(queryParams, onSelect)]
          return sources
        }
      }
    />
  )
}

export const AreaSearchAutoCompleteControl = ({
  id = 'areaSearch',
  label,
  queryParams,
  placeholder = 'Try \u201CSmith Rock\u201D',
  onReset,
  onSelect,
  errorMesage,
  tip
}: AutoCompleteFormControlProps): JSX.Element => {
  const { control } = useFormContext()
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-semibold'>{label}</span>
      </label>
      <Controller
        control={control}
        name={id}
        render={
          ({ field: { onChange, onBlur } }) =>
            <AreaSearchCore
              placeholder={placeholder}
              onSelect={(data) => {
                onChange({
                  target: {
                    value: data.areaUUID
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
        }
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
