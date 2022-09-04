import { useFormContext } from 'react-hook-form'

interface InputProps {
  label: string
  name: string
  placeholder: string
  rules: any
  className: string
}

export default function Input ({ label, name, rules, placeholder, className }: InputProps): JSX.Element {
  const { register, formState: { errors } } = useFormContext()
  const inputProps = register(name, rules)
  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-semibold'>{label}</span>
      </label>
      <input
        {...inputProps}
        type='text'
        placeholder={placeholder}
        className={className}
      />
      <label className='label'>
        {errors?.[name]?.message != null &&
           (<span className='label-text-alt text-error'>{errors?.[name]?.message as string}</span>)}
      </label>
    </div>
  )
}
