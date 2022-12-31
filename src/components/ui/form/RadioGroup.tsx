import { useController } from 'react-hook-form'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import clx from 'classnames'
interface RadioGroupProps {
  groupLabel: string
  groupLabelAlt?: JSX.Element
  name: string
  labels: string[] | JSX.Element[]
  values: string[]
  labelTips?: string[] | JSX.Element[]
  disabled?: boolean
}

/**
 * A radio button group
 */
export default function RadioGroup ({ groupLabel, groupLabelAlt, name, labels, values, labelTips = [], disabled = false }: RadioGroupProps): JSX.Element | null {
  if (labels.length !== values.length) return null // Mismatched labels and values

  const { field } = useController({ name })
  const { value } = field

  return (
    <div className='form-control'>
      <label className='label'>
        <span className='cursor-pointer label-text font-semibold'>{groupLabel}</span>
        <span className='cursor-pointer label-text-alt'>{groupLabelAlt}</span>
      </label>
      <div className='bg-base-100 rounded-box px-1 divide-y'>
        {labels.map((label, index: number) => (
          <label key={index} className='label cursor-pointer justify-between gap-4'>
            <span
              className={
                clx(
                  'z-40 label-text',
                  labelTips?.[index] != null
                    ? 'tooltip tooltip-right tooltip-info drop-shadow-lg flex gap-1'
                    : '')
              }
              data-tip={labelTips[index]}
            >
              {label}{labelTips?.[index] != null && <QuestionMarkCircleIcon className='text-info w-3 h-3' />}
            </span>
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
      {/* <label className='label label-text-alt'>{labelTips[selectedIndex]}</label> */}
    </div>
  )
}
