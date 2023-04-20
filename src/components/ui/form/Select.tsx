import { Controller, RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form'
import clx from 'classnames'
import { DropdownMenu, DropdownContent, DropdownItem, DropdownTrigger, DropdownSeparator } from '../DropdownMenu'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline'

interface SelectProps {
  label: string
  labelAlt?: string | JSX.Element
  name: string
  options: string[]
  defaultOption: string
  helper?: string | JSX.Element
}

type BaseSelectProps = {
  name: string,
  formContext: UseFormReturn
  defaultOption: string,
  options: string[]
  btnClassName?: string,
}

/**
 * Wraps our custom DropdownMenu in react-hook-form's Controller
 * so that it can be used within a FormProvider.
 * @param param0
 * @returns 
 */
export const BaseSelect: React.FC<BaseSelectProps> = ({
 name, formContext, defaultOption, options, btnClassName = ''
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
          <DropdownTrigger className={clx(BUTTON_DEFAULT_CSS, btnClassName)}>
            {value} <ChevronDoubleDownIcon className='w-3 h-3 lg:w-4 lg:w-4' />
          </DropdownTrigger>

          <DropdownContent align='start'>
            <>
            {options.length >= 1 && 
              <DropdownItem
                text={options[0]}
                onSelect={() => onChange(options[0])}
              />
            }
            </>
            <>
            {options.length > 1 &&
              options.slice(1).map(option => <>
                <DropdownSeparator />
                <DropdownItem
                  text={option}
                  onSelect={() => onChange(option)}
                />
              </>)
            }
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
  label, labelAlt, name, options, defaultOption, helper,
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

const BUTTON_DEFAULT_CSS = 'btn btn-sm btn-outline w-fit gap-2'
