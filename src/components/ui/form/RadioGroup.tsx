import { useController } from 'react-hook-form'

interface RadioGroupProps {
  groupLabel: string
  groupLabelAlt?: JSX.Element
  name: string
  labels: string[] | JSX.Element[]
  values: string[]
  labelTips?: string[]
  disabled?: boolean
  requiredErrorMessage: string
}

/**
 * A radio button group.  An option must be selected.
 */
export default function RadioGroup ({ groupLabel, groupLabelAlt, name, labels, values, labelTips = [], requiredErrorMessage, disabled = false }: RadioGroupProps): JSX.Element | null {
  if (labels.length !== values.length) return null // Mismatched labels and values

  const { field, formState: { errors } } = useController({
    name,
    rules: {
      required: requiredErrorMessage
    }
  })
  const { value } = field

  const error = errors?.[name]

  return (
    <div className='form-control'>
      <label className='label'>
        <span className='cursor-pointer label-text font-semibold uppercase'>{groupLabel}</span>
        <span className='cursor-pointer label-text-alt'>{groupLabelAlt}</span>
      </label>
      <div className='bg-base-100 rounded-box divide-y border'>
        {labels.map((label, index: number) => (
          <label key={index} className='label cursor-pointer px-4'>
            <div className=''>
              <div>{label}</div>
              {labelTips?.[index] != null &&
                <div className='text-xs text-base-200'>
                  {labelTips[index]}
                </div>}
            </div>
            <input
              type='radio'
              className='radio'
              disabled={disabled}
              {...field}
              value={values[index]}
              checked={value === values[index]}
            />
          </label>
        ))}
      </div>
      <label className='label' id={`${name}-helper`} htmlFor={name}>
        {error?.message != null &&
           (<span className='label-text-alt text-error'>{error?.message as string}</span>)}
      </label>
    </div>
  )
}
