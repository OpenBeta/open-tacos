'use client'
import { CLIMB_LOCATION_FORM_VALIDATION_RULES } from '../validation'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { MarkdownTextArea } from '@/components/ui/form/MarkdownTextArea'
import { SingleEntryForm } from '@/app/(default)/components/AreaAndClimb/SingleEntryForm'

export const ClimbLocationForm: React.FC<{ initialValue: string, uuid: string, parentId: string, accessToken: string }> = ({ initialValue, uuid, parentId, accessToken }) => {
  const { updateClimbCmd } = useUpdateClimbsCmd({
    parentId,
    accessToken
  })

  return (
    <SingleEntryForm<{ location: string }>
      title='Location'
      helperText='You can use markdown syntax: **bold** *italic* [link](https://example.com).'
      initialValues={{ location: initialValue }}
      submitHandler={async ({ location }) => {
        const input = {
          parentId,
          changes: [{ id: uuid, location }]
        }
        await updateClimbCmd(input)
      }}
    >
      <MarkdownTextArea
        initialValue={initialValue}
        name='location'
        label='Describe this location to the best of your knowledge.  Do not copy beta from guidebooks.'
        rules={CLIMB_LOCATION_FORM_VALIDATION_RULES}
      />
    </SingleEntryForm>
  )
}