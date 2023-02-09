import React from 'react'
import { Field, FieldMetaProps } from 'formik'

interface TextFieldProps {
  /** key name for data */
  name: string
  /** HTML label rendered for this input */
  label: string
  /** Is this text input multiple lines? */
  multiline?: boolean
  /** (If multiline) how many rows should this input have */
  rows?: number
  spellcheck?: boolean
  /** Wait until submit to validate, or perform the validation immediately */
  validateImmediately?: boolean
  /** Used to prompt user to change username */
  isChanged?: boolean
  /** return an error message or undefined for valid input */
  validate?: (value: any) => Promise<undefined|string>
}

interface FieldType {
  field: any
  meta: FieldMetaProps<string>
}

/**
 * Responsive Formik-textfield with some added utility for our purposes.
 * fullwidth by intent, and design. designed to be vertically stacked
 * and labelled.
 */
const TextField = (props: TextFieldProps): JSX.Element => (
  <div className='edit-form-row w-full'>
    <label className='font-semibold md:w-36 md:-mt-2' htmlFor={props.name}>
      {props.label}
    </label>

    <Field
      id={props.name}
      name={props.name}
      {...props.validate != null ? { validate: props.validate } : null}
    >
      {({ field, meta }: FieldType) => (
        <div className='w-full'>

          {props.multiline === true
            ? (<textarea
                className='w-full edit-input'
                rows={props.rows}
                {...field}
                spellCheck={props.spellcheck}
               />)
            : (<input
                className='w-full edit-input'
                type='text'
                {...field}
                spellCheck={props.spellcheck}
               />)}

          <div className='h-3 pt-1 px-3 text-blue-500'>
            {(props.isChanged !== true) && 'You may change your user name'}
          </div>

          <div className='h-3 text-sm pt-1 px-3 text-pink-600'>
            {(props.validateImmediately === true || meta.touched) && (meta?.error ?? '')}
          </div>
        </div>
      )}
    </Field>
  </div>
)
export default TextField
