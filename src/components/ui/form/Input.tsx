import { useFormContext, UseFormReturn } from 'react-hook-form'
import clx from 'classnames'

interface InputProps {
  label: string
  name: string
  placeholder?: string
  rules?: any
  className?: string
  helper?: string | JSX.Element
  formContext?: UseFormReturn
}

export default function Input ({ label, name, rules, placeholder = '', className, helper, formContext }: InputProps): JSX.Element {
  const context = formContext == null ? useFormContext() : formContext
  const { register, formState: { errors, isSubmitSuccessful } } = context
  const inputProps = register(name, rules)
  return (
    <div className={clx('form-control', isSubmitSuccessful ? 'disabled' : '')}>
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
      />
      <label className='label' id={`${name}-helper`} htmlFor={name}>
        {errors?.[name]?.message != null &&
           (<span className='label-text-alt text-error'>{errors?.[name]?.message as string}</span>)}
        {((errors?.[name]) == null) && helper}
      </label>
    </div>
  )
}
