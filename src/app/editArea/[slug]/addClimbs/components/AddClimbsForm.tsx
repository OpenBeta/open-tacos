'use client'
import { useSession } from 'next-auth/react'

import { SingleEntryForm } from 'app/editArea/[slug]/components/SingleEntryForm'
import { AREA_DESCRIPTION_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { MarkdownTextArea } from '@/components/ui/form/MarkdownTextArea'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { DashboardInput } from '@/components/ui/form/Input'
import { DynamicClimbInputList } from './DynamicClimbInputList'
/**
 * Area description edit form
 * @param param0
 * @returns
 */
export const AddClimbsForm: React.FC<{ parentAreaUuid: string }> = ({ parentAreaUuid }) => {
  const session = useSession({ required: true })
  const { updateClimbCmd } = useUpdateClimbsCmd(
    {
      parentId: parentAreaUuid,
      accessToken: session?.data?.accessToken as string
    }
  )

  return (
    <SingleEntryForm<{ climbList: any[] }>
      title='Add climbs'
      initialValues={{ climbList: [{ climbName: '' }] }}
      // initialValues={{ description: initialValue }}
      submitHandler={async (data) => {
        console.log(data)
        // await updateClimbCmd({ description })
      }}
    >
      <DynamicClimbInputList parentAreaUuid={parentAreaUuid} name='climbList' />
    </SingleEntryForm>
  )
}
