'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from '@/app/(default)/editArea/[slug]/components/SingleEntryForm'
import { AREA_LOCATION_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { MarkdownTextArea } from '@/components/ui/form/MarkdownTextArea'

export const ClimbLocationForm: React.FC<{ initialValue: string, uuid: string, parentId: string }> = ({ initialValue, uuid, parentId }) => {
  const session = useSession({ required: true })
  const { updateClimbCmd } = useUpdateClimbsCmd(
    {
      parentId,
      accessToken: session?.data?.accessToken as string
    }
  )

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
        name='areaLocation'
        label='Describe this location to the best of your knowledge.  Do not copy beta from guidebooks.'
        rules={AREA_LOCATION_FORM_VALIDATION_RULES}
      />
    </SingleEntryForm>
  )
}
