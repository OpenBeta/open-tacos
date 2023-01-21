import { useController } from 'react-hook-form'

interface Props {
  label: string
  name: string
  disabled?: boolean
}

/**
 * A radio button group
 */
export default function Checkbox ({ label, name, disabled = false }: Props): JSX.Element {
  const { field } = useController({ name })
  const { value } = field

  return (
    <div className='form-control'>
      <label className='label bg-base-100 rounded-box px-1'>
        <span className='cursor-pointer label-text'>{label}</span>
        <input type='checkbox' {...field} checked={value === true} className='checkbox' />
      </label>
    </div>
  )
}
