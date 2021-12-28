import React from 'react'
import { Field } from 'formik'
import XCircleIcon from '../../assets/icons/xcircle.svg'
import PlusSmalllIcon from '../../assets/icons/plus-sm.svg'

/**
 * Formik pill style checkbox
 * @param name key name for data
 * @param label text label
 */
const CheckBox = ({ name, label }) => {
  return (
    <Field name={name}>
      {({ field, form, meta }) => {
        return (
          <>
            <label
              className={`rounded-full py-0.5 pl-2 pr-1 flex items-center border border-gray-300 bg-gray-100 cursor-pointer ${
                field.value ? 'bg-gray-700' : ''
              }`}
              onClick={() => {
                form.setFieldValue(name, !field.value, false)
              }}
              htmlFor={name}
            >
              <input // this is for a11y -  TODO: find a pre-made component
                type='checkbox'
                className='opacity-0 w-1 h-1'
                checked={field.value}
                onChange={() => form.setFieldValue(name, !field.value, false)}
              />
              <span
                className={`text-sm font-base uppercase mr-2 ${
                  field.value ? 'text-white' : ''
                }`}
              >
                {label}
              </span>
              {field.value
                ? (
                  <XCircleIcon className='w-5 h-5 text-gray-300' />
                  )
                : (
                  <PlusSmalllIcon className='w-5 h-5 text-gray-300 hover:text-gray-600' />
                  )}
            </label>
          </>
        )
      }}
    </Field>
  )
}
export default CheckBox
