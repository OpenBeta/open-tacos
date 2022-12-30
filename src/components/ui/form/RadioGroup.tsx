import { useController } from 'react-hook-form'

interface RadioGroupProps {
  groupLabel: string
  groupLabelAlt?: JSX.Element
  name: string
  labels: string[] | JSX.Element[]
  values: string[]
  disabled?: boolean
}

/**
 * A radio button group
 */
export default function RadioGroup ({ groupLabel, groupLabelAlt, name, labels, values, disabled = false }: RadioGroupProps): JSX.Element | null {
  if (labels.length !== values.length) return null // Mismatched labels and values

  const { field } = useController({ name })
  const { value } = field

  return (
    <>
      <div className='form-control'>
        <label className='label'>
          <span className='cursor-pointer label-text font-semibold'>{groupLabel}</span>
          <span className='cursor-pointer label-text-alt'>{groupLabelAlt}</span>
        </label>
        <div className='bg-base-100 rounded-box px-1 divide-y'>
          {labels.map((label, index: number) => (
            <label key={index} className='label cursor-pointer justify-start gap-4'>
              <input
                type='radio'
                className='radio'
                disabled={disabled}
                {...field}
                value={values[index]}
                checked={value === values[index]}
              />
              <span className='label-text'>{label}</span>
            </label>
          ))}
        </div>
        <label className='label label-text-alt'>&nbsp;</label>
      </div>
    </>
  )
}
