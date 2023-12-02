'use client'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import clx from 'classnames'
import dynamic from 'next/dynamic'

import { RulesType } from '@/js/types'
import { MarkdownEditorProps } from '@/components/editor/MarkdownEditor'

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  label: string
  placeholder?: string
  rules?: RulesType
}

/**
 * Multiline inplace editor with react-hook-form support.
 */
export const MarkdownTextArea: React.FC<EditorProps> = ({ initialValue = '', name, placeholder = 'Enter some text', label, rules }) => {
  const { fieldState: { error } } = useController({ name, rules })
  const [preview, setPreview] = useState(false)
  return (
    <div className='form-control'>
      <label className='flex flex-col items-start justify-start gap-2 pb-2' htmlFor={name}>
        <span className='text-md'>{label}</span>
      </label>

      <div className='tabs mb-4'>
        <a className={clx('tab  tab-bordered', preview ? '' : 'tab-active')} onClick={() => setPreview(false)}>
          Write
        </a>
        <a className={clx('tab  tab-bordered', preview ? 'tab-active' : '')} onClick={() => setPreview(true)}>
          Preview
        </a>
      </div>

      <LazyMarkdownEditor
        initialValue={initialValue}
        preview={preview}
        reset={0}
        fieldName={name}
        className='border rounded-btn wiki-content'
        previewClassname='border-none'
      />

      {error?.message != null &&
        <label className='label' id={`${name}-helper`} htmlFor={name}>
          <span className='text-error'>{error?.message}</span>
        </label>}
    </div>
  )
}

/**
 * Lazy load to avoid Next hydration issue.
 */
export const LazyMarkdownEditor = dynamic<MarkdownEditorProps>(async () => await import('@/components/editor/MarkdownEditor').then(
  module => module.MarkdownEditor), {
  ssr: true
})
