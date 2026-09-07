'use client'
import { CLIMB_DESCRIPTION_FORM_VALIDATION_RULES } from '../validation'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { MarkdownTextArea } from '@/components/ui/form/MarkdownTextArea'
import { SingleEntryForm } from '@/app/(default)/components/AreaAndClimb/SingleEntryForm'

export const ClimbDescriptionForm: React.FC<{ initialValue: string, uuid: string, parentId: string, accessToken: string }> = ({ initialValue, uuid, parentId, accessToken }) => {
  const { updateClimbCmd } = useUpdateClimbsCmd({
    parentId,
    accessToken
  })

  return (
    <SingleEntryForm<{ description: string }>
      title='Description'
      helperText='You can use markdown syntax: **bold** *italic* [link](https://example.com).'
      initialValues={{ description: initialValue }}
      submitHandler={async ({ description }) => {
        const input = {
          parentId,
          changes: [{ id: uuid, description }]
        }
        await updateClimbCmd(input)
      }}
    >
      <MarkdownTextArea
        initialValue={initialValue}
        name='description'
        label='Describe this climb to the best of your knowledge.  Do not copy descriptions from guidebooks.'
        rules={CLIMB_DESCRIPTION_FORM_VALIDATION_RULES}
      />
    </SingleEntryForm>
  )
}