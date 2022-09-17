import { RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form'

interface InputProps {
  label: string
  name: string
  placeholder?: string
  registerOptions?: RegisterOptions
  className?: string
  helper?: string | JSX.Element
  formContext?: UseFormReturn
  disabled?: boolean
  readOnly?: boolean
}

export default function Input ({ label, name, registerOptions, placeholder = '', className, helper, formContext, disabled = false, readOnly = false }: InputProps): JSX.Element {
  const context = formContext == null ? useFormContext() : formContext
  const { register, formState: { errors } } = context
  const inputProps = register(name, registerOptions)
  return (
    <div className='form-control'>
      <label className='label' htmlFor={name}>
        <span className='label-text font-semibold'>{label}</span>
      </label>
      <input
        id={name}
        {...inputProps}
        type='text'
        placeholder={placeholder}
        className={className}
        aria-label={label}
        aria-describedby={`${name}-helper`}
        disabled={disabled}
        readOnly={readOnly}
      />
      <label className='label' id={`${name}-helper`} htmlFor={name}>
        {errors?.[name]?.message != null &&
           (<span className='label-text-alt text-error'>{errors?.[name]?.message as string}</span>)}
        {((errors?.[name]) == null) && helper}
      </label>
    </div>
  )
}
