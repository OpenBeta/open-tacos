'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from '@/app/(default)/editArea/[slug]/components/SingleEntryForm'
import { AREA_LOCATION_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { MarkdownTextArea } from '@/components/ui/form/MarkdownTextArea'

/**
 * Area location edit form
 * @param param0
 * @returns
 */
export const AreaLocationForm: React.FC<{ initialValue: string, uuid: string }> = ({ initialValue, uuid }) => {
  const session = useSession({ required: true })
  const { updateOneAreaCmd } = useUpdateAreasCmd(
    {
      areaId: uuid,
      accessToken: session?.data?.accessToken as string
    }
  )

  return (
    <SingleEntryForm<{ areaLocation: string }>
      title='Location'
      helperText='You can use markdown syntax: **bold** *italic* [link](https://example.com).'
      initialValues={{ areaLocation: initialValue }}
      submitHandler={async ({ areaLocation }) => {
        await updateOneAreaCmd({ areaLocation })
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
