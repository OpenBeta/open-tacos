'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { SingleEntryForm } from 'app/editArea/[slug]/components/SingleEntryForm'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { DynamicClimbInputList } from './DynamicClimbInputList'
import { GradeContexts } from '@/js/grades/Grade'
import { defaultDisciplines } from '@/js/grades/util'
import { IndividualClimbChangeInput } from '@/js/graphql/gql/contribs'

export type QuickAddNewClimbProps =
  Partial<IndividualClimbChangeInput> &
  Required<Pick<IndividualClimbChangeInput, 'name' | 'disciplines' | 'grade'>>

export interface AddClimbsFormData {
  climbList: QuickAddNewClimbProps[]
}

/**
 * Add new climbs to an area form
 */
export const AddClimbsForm: React.FC<{ parentAreaName: string, parentAreaUuid: string, gradeContext: GradeContexts, canAddClimbs: boolean }> = ({ parentAreaName, parentAreaUuid, gradeContext, canAddClimbs }) => {
  const router = useRouter()
  const session = useSession({ required: true })
  const { updateClimbCmd } = useUpdateClimbsCmd(
    {
      parentId: parentAreaUuid,
      accessToken: session?.data?.accessToken as string
    }
  )

  return (
    <SingleEntryForm<AddClimbsFormData>
      title={`Add climbs to ${parentAreaName} area`}
      initialValues={{ climbList: [{ name: '', disciplines: defaultDisciplines() }] }}
      validationMode='onSubmit'
      alwaysEnableSubmit
      keepValuesAfterReset={false}
      submitHandler={async (data) => {
        const { climbList } = data
        const changes = climbList.filter(el => el.name.trim() !== '')
        await updateClimbCmd({ parentId: parentAreaUuid, changes })
        router.refresh() // Ask Next to refresh props from the server
      }}
    >
      {canAddClimbs
        ? <DynamicClimbInputList
            parentAreaUuid={parentAreaUuid}
            gradeContext={gradeContext}
          />
        : (
          <div role='alert' className='alert alert-info'>
            <p className='text-sm'>Operation not available.  You can only add climbs to a crag or a boulder.</p>
          </div>
          )}

    </SingleEntryForm>
  )
}
