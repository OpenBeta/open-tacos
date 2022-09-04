import { useFormContext } from 'react-hook-form'

interface RadioGroupProps {
  groupLabel: string
  name: string
  labels: string[]
  values: string[] | number[]
}

export default function RadioGroup ({ groupLabel, name, labels, values }: RadioGroupProps): JSX.Element {
  const { register } = useFormContext()
  const props = register(name)
  return (
    <>
      <div className='form-control'>
        <label className='label cursor-pointer label-text font-semibold'>{groupLabel}</label>
        <div className='bg-base-100 rounded-box px-1 divide-y'>
          {labels.map((label, index) =>
            (
              <label key={label} className='label cursor-pointer'>
                <span className='label-text'>{label}</span>
                <input
                  type='radio'
                  className='radio'
                  value={values[index]}
                  {...props}
                />
              </label>
            ))}
        </div>
        <label className='label label-text-alt'>&nbsp;</label>
      </div>
    </>
  )
}
