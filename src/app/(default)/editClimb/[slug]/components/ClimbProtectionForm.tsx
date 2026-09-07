'use client'
import { CLIMB_PROTECTION_FORM_VALIDATION_RULES } from '../validation'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { MarkdownTextArea } from '@/components/ui/form/MarkdownTextArea'
import { SingleEntryForm } from '@/app/(default)/components/AreaAndClimb/SingleEntryForm'

export const ClimbProtectionForm: React.FC<{ initialValue: string, uuid: string, parentId: string, accessToken: string }> = ({ initialValue, uuid, parentId, accessToken }) => {
  const { updateClimbCmd } = useUpdateClimbsCmd({
    parentId,
    accessToken
  })

  return (
    <SingleEntryForm<{ protection: string }>
      title='Protection'
      helperText='You can use markdown syntax: **bold** *italic* [link](https://example.com).'
      initialValues={{ protection: initialValue }}
      submitHandler={async ({ protection }) => {
        const input = {
          parentId,
          changes: [{ id: uuid, protection }]
        }
        await updateClimbCmd(input)
      }}
    >
      <MarkdownTextArea
        initialValue={initialValue}
        name='protection'
        label='Describe the protection to the best of your knowledge.  Do not copy beta from guidebooks.'
        rules={CLIMB_PROTECTION_FORM_VALIDATION_RULES}
      />
    </SingleEntryForm>
  )
}