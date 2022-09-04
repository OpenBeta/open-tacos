import { useFormContext } from 'react-hook-form'

interface InputProps {
  label: string
  name: string
  placeholder?: string
  rules?: any
  className?: string
  helper?: string | JSX.Element
}

export default function Input ({ label, name, rules, placeholder = '', className, helper }: InputProps): JSX.Element {
  const { register, formState: { errors } } = useFormContext()
  const inputProps = register(name, rules)
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
      />
      <label className='label' id={`${name}-helper`} htmlFor={name}>
        {errors?.[name]?.message != null &&
           (<span className='label-text-alt text-error'>{errors?.[name]?.message as string}</span>)}
        {((errors?.[name]) == null) && helper}
      </label>
    </div>
  )
}
