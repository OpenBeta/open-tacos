import { FormState, RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form'
import clx from 'classnames'
import { SpinnerGap } from '@phosphor-icons/react/dist/ssr'

interface InputProps {
  label?: string
  labelAlt?: string | JSX.Element
  unitLabel?: string
  unitLabelPlacement?: 'left' | 'right'
  affixClassname?: string
  name: string
  placeholder?: string
  registerOptions?: RegisterOptions
  className?: string
  classDefault?: string
  helper?: string | JSX.Element
  disabled?: boolean
  readOnly?: boolean
  type?: 'text' | 'number' | 'email'
  spellCheck?: boolean
}

type BaseInputProps = InputProps & {
  formContext: UseFormReturn
}

export const BaseInput: React.FC<BaseInputProps> = ({ label, name, placeholder = '', className = '', classDefault = INPUT_DEFAULT_CSS, affixClassname = AFFIX_DEFAULT_CSS, disabled = false, readOnly = false, formContext, registerOptions, type = 'text', spellCheck = true }) => {
  const { register } = formContext
  const inputProps = register(name, registerOptions)

  return (
    <input
      id={name}
      {...inputProps}
      type={type}
      placeholder={placeholder}
      className={clx(classDefault, className)}
      aria-label={label}
      aria-describedby={`${name}-helper`}
      disabled={disabled}
      readOnly={readOnly}
      spellCheck={spellCheck}
    />
  )
}

/**
 * A reusable react-hook-form input field
 */
export default function Input ({ label, labelAlt, unitLabel, unitLabelPlacement = 'right', name, registerOptions, placeholder = '', className = '', classDefault = INPUT_DEFAULT_CSS, affixClassname = AFFIX_DEFAULT_CSS, helper, disabled = false, readOnly = false, type = 'text', spellCheck = true }: InputProps): JSX.Element {
  const formContext = useFormContext()
  const { formState: { errors } } = formContext

  const error = errors?.[name]
  return (
    <div className='form-control'>
      <label className='label' htmlFor={name}>
        {label != null && <span className='label-text font-semibold'>{label}</span>}
        {labelAlt != null && <span className='label-text-alt'>{labelAlt}</span>}
      </label>
      {unitLabel == null
        ? (<BaseInput
            name={name}
            placeholder={placeholder}
            className={clx(classDefault, className)}
            label={label}
            disabled={disabled}
            readOnly={readOnly}
            formContext={formContext}
            registerOptions={registerOptions}
            type={type}
            spellCheck={spellCheck}
           />)
        : (
          <label className='input-group'>
            {unitLabelPlacement === 'left' && <span className={affixClassname}>{unitLabel}</span>}
            <BaseInput
              name={name}
              placeholder={placeholder}
              className={clx(classDefault, className)}
              label={label}
              disabled={disabled}
              readOnly={readOnly}
              registerOptions={registerOptions}
              formContext={formContext}
              type={type}
              spellCheck={spellCheck}
            />
            {unitLabelPlacement === 'right' && <span className={affixClassname}>{unitLabel}</span>}
          </label>
          )}

      <label className='label' id={`${name}-helper`} htmlFor={name}>
        {error?.message != null &&
           (<span className='label-text-alt text-error'>{error?.message as string}</span>)}
        {(error == null) && <span className='label-text-alt label-helper'>{helper}</span>}
      </label>
    </div>
  )
}

export const INPUT_DEFAULT_CSS = 'input input-primary input-bordered input-md focus:outline-0 focus:ring-1 focus:ring-primary'

const AFFIX_DEFAULT_CSS = 'bg-default uppercase text-sm'

export interface DashboardInputProps {
  name: string
  label: string
  description: string
  helper: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  registerOptions?: RegisterOptions
  type?: 'text' | 'number' | 'email'
  spellCheck?: boolean
  className?: string

}

export const DashboardInput: React.FC<DashboardInputProps> = ({ name, label, description, helper, placeholder, disabled = false, readOnly = false, registerOptions, type = 'text', spellCheck = false, className = '' }) => {
  const formContext = useFormContext()
  const { formState: { errors, isValid, isSubmitting, isDirty } } = formContext

  const error = errors?.[name]
  return (
    <div className='card card-compact card-bordered border-base-300  overflow-hidden w-full'>
      <div className='form-control'>
        <div className='p-6 bg-base-100'>
          <label className='flex flex-col items-start justify-start gap-2 pb-2' htmlFor={name}>
            <h2 className='font-semibold text-2xl'>{label}</h2>
            <span className='text-md'>{description}</span>
          </label>
          <BaseInput
            name={name}
            placeholder={placeholder}
            className={clx(INPUT_DEFAULT_CSS, className)}
            label={label}
            disabled={disabled}
            readOnly={readOnly}
            formContext={formContext}
            registerOptions={registerOptions}
            type={type}
            spellCheck={spellCheck}
          />
        </div>
        {/* Footer */}
        <div className='px-6 py-2 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-base-200 border-t'>
          <label className='label' id={`${name}-helper`} htmlFor={name}>
            {error?.message != null &&
           (<span className='text-error'>{error?.message as string}</span>)}
            {(error == null) && <span className='text-base-content/60'>{helper}</span>}
          </label>
          <SubmitButton isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} />
        </div>
      </div>
    </div>
  )
}

export const SubmitButton: React.FC<{ isValid: boolean, isSubmitting: boolean, isDirty: boolean }> = ({
  isValid, isSubmitting, isDirty
}) => (
  <button
    className='btn btn-primary btn-solid w-full lg:w-fit'
    disabled={!isValid || isSubmitting || !isDirty}
    type='submit'
  >
    {isSubmitting && <SpinnerGap size={24} className='animate-spin' />} Save
  </button>
)
