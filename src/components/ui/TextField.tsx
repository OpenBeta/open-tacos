import React from 'react'
import { Field, FieldMetaProps } from 'formik'

interface TextFieldProps {
  name: string
  label: string
  multiline?: boolean
  rows?: number
  spellcheck?: boolean
  validateImmediately?: boolean
  validate?: (value: any) => Promise<undefined|string> // return an error message or undefined for valid input
}

interface FieldType {
  field: any
  meta: FieldMetaProps<string>
}

/**
 * Responsive Formik-textfield
 * @param name key name for data
 * @param label text label
 * @param multiline
 * @param validate Optional validate function
 * @param validateImmediately Set to true if you want immediate validation as the user is typing.  Default behvavoir is to run validation on blur.
 */
const TextField = ({ name, label, multiline = false, rows = 3, validate, spellcheck = false, validateImmediately = false }: TextFieldProps): JSX.Element => (
  <div className='edit-form-row '>
    <label className='font-semibold md:w-36 md:-mt-2' htmlFor={name}>
      {label}
    </label>
    <Field id={name} name={name} {...validate != null ? { validate } : null}>
      {({ field, meta }: FieldType) => (
        <div className='w-full'>

          {multiline
            ? (<textarea
                className='w-full edit-input'
                rows={rows}
                {...field}
                spellCheck={spellcheck}
               />)
            : (<input
                className='w-full edit-input'
                type='text'
                {...field}
                spellCheck={spellcheck}
               />)}

          <div className='h-3 text-sm pt-1 px-3 text-pink-600'>
            {(validateImmediately || meta.touched) && (meta?.error ?? '')}
          </div>
        </div>
      )}
    </Field>
  </div>
)
export default TextField
