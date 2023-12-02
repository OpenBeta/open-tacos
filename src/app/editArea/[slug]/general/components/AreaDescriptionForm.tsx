'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from 'app/editArea/[slug]/components/SingleEntryForm'
import { AREA_DESCRIPTION_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { MarkdownTextArea } from '@/components/ui/form/MarkdownTextArea'

/**
 * Area description edit form
 * @param param0
 * @returns
 */
export const AreaDescriptionForm: React.FC<{ initialValue: string, uuid: string }> = ({ initialValue, uuid }) => {
  const session = useSession({ required: true })
  const { updateOneAreaCmd } = useUpdateAreasCmd(
    {
      areaId: uuid,
      accessToken: session?.data?.accessToken as string
    }
  )

  return (
    <SingleEntryForm<{ description: string }>
      title='Description'
      helperText='You can use markdown syntax: **bold** *italic* [link](https://example.com).'
      initialValues={{ description: initialValue }}
      submitHandler={async ({ description }) => {
        await updateOneAreaCmd({ description })
      }}
    >
      <MarkdownTextArea
        initialValue={initialValue}
        name='description'
        label='Describe this area to the best of your knowledge.  Do not copy descriptions from guidebooks.'
        rules={AREA_DESCRIPTION_FORM_VALIDATION_RULES}
      />
    </SingleEntryForm>
  )
}
