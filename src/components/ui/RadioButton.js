import React from 'react'
import { Field } from 'formik'

/**
 * Formik-radio button
 * @param id unique id for this radio button
 * @param groupName Key name for data.
 * @param value return value when selected
 * @param label text label
 */
const RadioButton = ({ id, groupName, value, label }) => {
  const idStr = `${groupName}${id}`
  return (
    <div>
      <Field
        className='hidden'
        id={idStr}
        type='radio'
        name={groupName}
        value={value}
      />
      <label
        className='pill flex flex-col border border-gray-200 cursor-pointer'
        htmlFor={idStr}
      >
        <span className='text-sm font-semibold whitespace-nowrap'>
          {label}
        </span>
      </label>
    </div>
  )
}
export default RadioButton
