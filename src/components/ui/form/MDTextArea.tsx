'use client'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import clx from 'classnames'
import dynamic from 'next/dynamic'

import { RulesType } from '@/js/types'
import { MarkdownEditorProps } from '@/components/editor/MarkdownEditor'
import { SubmitButton } from './Input'

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  label: string
  description: string
  helper: string
  placeholder?: string
  rules?: RulesType
}

/**
 * Multiline inplace editor with react-hook-form support.
 */
export const MDTextArea: React.FC<EditorProps> = ({ initialValue = '', name, placeholder = 'Enter some text', label, description, helper, rules }) => {
  const { fieldState: { error }, formState: { isValid, isDirty, isSubmitting } } = useController({ name, rules })
  const [preview, setPreview] = useState(false)
  return (
    <div className='card card-compact card-bordered border-base-300  overflow-hidden w-full'>
      <div className='form-control'>
        <div className='p-6 bg-base-100'>
          <label className='flex flex-col items-start justify-start gap-2 pb-2' htmlFor={name}>
            <h2 className='font-semibold text-2xl'>{label}</h2>
            <span className='text-md'>{description}</span>
          </label>

          <div className='tabs mb-4'>
            <a className={clx('tab  tab-bordered', preview ? '' : 'tab-active')} onClick={() => setPreview(false)}>
              Write
            </a>
            <a className={clx('tab  tab-bordered', preview ? 'tab-active' : '')} onClick={() => setPreview(true)}>
              Preview
            </a>
          </div>

          <MarkdownEditor initialValue={initialValue} preview={preview} reset={0} fieldName={name} />

        </div>
        {/* Footer */}
        <div className='px-6 py-2 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-base-200 border-t'>
          <label className='label' id={`${name}-helper`} htmlFor={name}>
            {error?.message != null &&
           (<span className='text-error'>{error?.message}</span>)}
            {(error == null) && <span className='text-base-content/60'>{helper}</span>}
          </label>
          <SubmitButton isDirty={isDirty} isSubmitting={isSubmitting} isValid={isValid} />
        </div>
      </div>
    </div>
  )
}

export const MarkdownEditor = dynamic<MarkdownEditorProps>(async () => await import('@/components/editor/MarkdownEditor').then(
  module => module.MarkdownEditor), {
  ssr: true
}
)
