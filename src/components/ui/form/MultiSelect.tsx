import { Controller, useFormContext, UseFormReturn } from 'react-hook-form'
import ComboBox, { ValueObj } from '../ComboBox'

interface MultiSelectProps {
  label: string
  labelAlt?: string | JSX.Element
  name: string
  options: string[]
  defaultOptions?: string[]
  disabledOptions?: string[]
  helper?: string | JSX.Element
}

interface BaseMultiSelectProps {
  name: string
  formContext: UseFormReturn
  options: string[]
  defaultOptions?: string[]
  disabledOptions?: string[]
}

/**
 * Wraps our custom ComboBox multi-selector in react-hook-form's Controller
 * so that it can be used within a FormProvider.
 * @param param0
 * @returns
 */
export const BaseMultiSelect: React.FC<BaseMultiSelectProps> = ({
  name, formContext, options, defaultOptions, disabledOptions
}) => {
  const { control } = formContext

  // ComboBox uses ValueObjs, need to convert the strings into them.
  const valueObjOptions = options.map((option, idx) => {
    return {
      id: idx,
      name: option,
      disabled: disabledOptions?.includes(option) ?? false
    }
  })

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultOptions}
      render={({
        field: { onChange, value }
      }) => {
        // Map value (array of strings) to their corresponding valueObjs.
        if (value == null) return <div>Loading ... </div>
        const valueObj = value.map(v => valueObjOptions.find(voo => voo.name === v))
        if (valueObj == null) throw new Error('value does not match any of the options supplied')

        // Expects arrays since ComboBox set to `multiple`.
        const valueObjAcceptingOnChange = (valueObjs: ValueObj[]): void => {
          onChange(valueObjs.map(valueObj => valueObj.name))
        }
        return (
          <ComboBox
            label=''
            options={valueObjOptions}
            onChange={valueObjAcceptingOnChange}
            value={valueObj}
            selectClassName={SELECT_DEFAULT_CSS}
            multiple
          />
        )
      }}
    />
  )
}

/**
 * A reusable react-hook-form multi-select field.
 */
export default function MultiSelect ({
  label, labelAlt, name, options, defaultOptions, disabledOptions, helper
}: MultiSelectProps): JSX.Element {
  const formContext = useFormContext()
  const { formState: { errors } } = formContext
  const error = errors?.[name]
  return (
    <div className='form-control'>
      <label className='label' htmlFor={name}>
        <span className='label-text font-semibold'>{label}</span>
        {labelAlt != null && <span className='label-text-alt'>{labelAlt}</span>}
      </label>
      <BaseMultiSelect
        name={name}
        formContext={formContext}
        options={options}
        defaultOptions={defaultOptions}
        disabledOptions={disabledOptions}
      />
      <label className='label' id={`${name}-helper`} htmlFor={name}>
        {error?.message != null &&
           (<span className='label-text-alt text-error'>{error?.message as string}</span>)}
        {(error == null) && helper}
      </label>
    </div>
  )
}

const SELECT_DEFAULT_CSS = 'select select-md input-primary font-normal w-full items-center'
