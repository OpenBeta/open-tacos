import { RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form'
import clx from 'classnames'

interface InputProps {
  label: string
  unitLabel?: string
  name: string
  placeholder?: string
  registerOptions?: RegisterOptions
  className?: string
  classDefault?: string
  helper?: string | JSX.Element
  disabled?: boolean
  readOnly?: boolean
  type?: 'text' | 'number'
}

type BaseInputProps = InputProps & {
  formContext: UseFormReturn
}

export const BaseInput: React.FC<BaseInputProps> = ({ label, name, placeholder = '', className = '', classDefault = INPUT_DEFAULT_CSS, disabled = false, readOnly = false, formContext, registerOptions, type = 'text' }) => {
  const { register } = formContext
  const inputProps = register(name, registerOptions)

  return (
    <input
      id={name}
      {...inputProps}
      type={type}
      placeholder={placeholder}
      className={clx(classDefault, className)}
      aria-label={label}
      aria-describedby={`${name}-helper`}
      disabled={disabled}
      readOnly={readOnly}
    />
  )
}

/**
 * A reusable react-hook-form input field
 */
export default function Input ({ label, unitLabel, name, registerOptions, placeholder = '', className = '', classDefault = INPUT_DEFAULT_CSS, helper, disabled = false, readOnly = false, type }: InputProps): JSX.Element {
  const formContext = useFormContext()
  const { formState: { errors } } = formContext

  const error = errors?.[name]
  return (
    <div className='form-control'>
      <label className='label' htmlFor={name}>
        <span className='label-text font-semibold'>{label}</span>
      </label>
      {unitLabel == null
        ? (<BaseInput
            name={name}
            placeholder={placeholder}
            className={clx(classDefault, className)}
            label={label}
            disabled={disabled}
            readOnly={readOnly}
            formContext={formContext}
            registerOptions={registerOptions}
            type={type}
           />)
        : (
          <label className='input-group'>
            <BaseInput
              name={name}
              placeholder={placeholder}
              className={clx(classDefault, className)}
              label={label}
              disabled={disabled}
              readOnly={readOnly}
              registerOptions={registerOptions}
              formContext={formContext}
              type={type}
            />
            <span className='bg-default uppercase text-sm'>{unitLabel}</span>
          </label>
          )}

      <label className='label' id={`${name}-helper`} htmlFor={name}>
        {error?.message != null &&
           (<span className='label-text-alt text-error'>{error?.message as string}</span>)}
        {(error == null) && helper}
      </label>
    </div>
  )
}

export const INPUT_DEFAULT_CSS = 'input input-primary input-bordered input-md focus:outline-0 focus:ring-1 focus:ring-primary'
