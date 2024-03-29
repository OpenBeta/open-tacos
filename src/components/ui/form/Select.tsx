import { Controller, useFormContext, UseFormReturn } from 'react-hook-form'
import clx from 'classnames'
import { DropdownMenu, DropdownContent, DropdownItem, DropdownTrigger, DropdownSeparator } from '../DropdownMenu'

interface SelectProps {
  label: string
  labelAlt?: string | JSX.Element
  name: string
  options: string[]
  defaultOption: string
  helper?: string | JSX.Element
}

interface BaseSelectProps {
  name: string
  formContext: UseFormReturn
  defaultOption: string
  options: string[]
  selectClassName?: string
}

/**
 * Wraps our custom DropdownMenu in react-hook-form's Controller
 * so that it can be used within a FormProvider.
 * @param param0
 * @returns
 */
export const BaseSelect: React.FC<BaseSelectProps> = ({
  name, formContext, defaultOption, options, selectClassName = ''
}) => {
  const { control } = formContext

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultOption}
      render={({
        field: { onChange, value }
      }) => (
        <DropdownMenu modal={false}>
          <DropdownTrigger className={clx(SELECT_DEFAULT_CSS, selectClassName)}>
            {value}
          </DropdownTrigger>

          <DropdownContent align='start'>
            <div key={0}>
              {options.length >= 1 &&
                <DropdownItem
                  text={options[0]}
                  onSelect={() => onChange(options[0])}
                />}
            </div>
            <>
              {options.length > 1 &&
              options.slice(1).map((option, idx) =>
                <div key={idx + 1}>
                  <DropdownSeparator />
                  <DropdownItem
                    text={option}
                    onSelect={() => onChange(option)}
                  />
                </div>
              )}
            </>
          </DropdownContent>
        </DropdownMenu>
      )}
    />
  )
}

/**
 * A reusable react-hook-form select field
 */
export default function Select ({
  label, labelAlt, name, options, defaultOption, helper
}: SelectProps): JSX.Element {
  const formContext = useFormContext()
  const { formState: { errors } } = formContext

  const error = errors?.[name]
  return (
    <div className='form-control'>
      <label className='label' htmlFor={name}>
        <span className='label-text font-semibold'>{label}</span>
        {labelAlt != null && <span className='label-text-alt'>{labelAlt}</span>}
      </label>
      <BaseSelect
        name={name}
        formContext={formContext}
        options={options}
        defaultOption={defaultOption}
      />
      <label className='label' id={`${name}-helper`} htmlFor={name}>
        {error?.message != null &&
           (<span className='label-text-alt text-error'>{error?.message as string}</span>)}
        {(error == null) && helper}
      </label>
    </div>
  )
}

const SELECT_DEFAULT_CSS = 'select select-sm input-primary font-normal'
