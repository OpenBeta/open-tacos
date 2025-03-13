'use client'
import { useSession } from 'next-auth/react'
import { useForm, FormProvider } from 'react-hook-form'
import { BoulderingGradeInput, TradSportGradeInput } from '@/components/edit/form/GradeTextInput'
import { TotalLengthInput } from '@/components/edit/form/TotalLengthInput'
import { LegacyFAInput } from '@/components/edit/form/LegacyFAInput'
import Grade from '@/js/grades/Grade'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { SubmitButton } from '../../../editArea/[slug]/components/SingleEntryForm'
import { ArticleLastUpdate } from '@/components/edit/ArticleLastUpdate'
import { removeTypenameFromDisciplines } from '@/js/utils'

interface SidebarNavProps {
  uuid: string
  pageDataForEdit: any
  alwaysEnableSubmit: boolean
  parentId: string
}

export interface ClimbEditFormProps {
  gradeStr: string
  // disciplines: ClimbDisciplineRecord
  legacyFA: string
  length?: number
}

/**
 * Sidebar navigation for area edit
 */
export const SidebarNav: React.FC<SidebarNavProps> = ({ uuid, pageDataForEdit, alwaysEnableSubmit = false, parentId }) => {
  const session = useSession({ required: true })

  const { updateClimbCmd } = useUpdateClimbsCmd({
    parentId,
    accessToken: session?.data?.accessToken as string
  })

  const {
    grades, type, parent, length, fa: legacyFA, authorMetadata
  } = pageDataForEdit

  const gradesObj = new Grade(parent.gradeContext, grades, type, parent.metadata.isBoulder)

  const formattedClimbData = { legacyFA, ...(length > 0 && { length }), disciplines: removeTypenameFromDisciplines(type), gradeStr: gradesObj.toString() }

  const form = useForm<ClimbEditFormProps>({
    defaultValues: { ...formattedClimbData }
  })

  const { handleSubmit, formState: { isValid, isSubmitting, isDirty }, watch } = form

  const disciplinesField = watch('disciplines')

  const isBouldering = parent.metadata.isBoulder || (disciplinesField.bouldering && !(disciplinesField.trad || disciplinesField.sport || disciplinesField.aid))

  const submitHandler = async (formData: ClimbEditFormProps): Promise<void> => {
    const { length, legacyFA } = formData

    const input = {
      parentId,
      changes: [{ id: uuid, fa: legacyFA, length }]
    }
    await updateClimbCmd(input)
  }

  return (
    <FormProvider {...form}>
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(submitHandler)}>
        <nav className='px-6'>
          {isBouldering && <BoulderingGradeInput gradeObj={gradesObj} />}
          {!isBouldering && <TradSportGradeInput gradeObj={gradesObj} />}
          <div className='flex items-center space-x-2 w-full' />
          <TotalLengthInput />
          <div className='mt-6'>
              <LegacyFAInput />
            </div>
          {(authorMetadata.createdAt != null || authorMetadata.updatedAt != null) && (
              <div className='mt-8  border-t border-b'>
                <ArticleLastUpdate {...authorMetadata} />
              </div>
            )}
          <div className='mt-6'>
            <SubmitButton
              isSubmitting={isSubmitting}
              isDirty={alwaysEnableSubmit ? true : isDirty}
              isValid={alwaysEnableSubmit ? true : isValid}
            />
          </div>
        </nav>
      </form>
    </FormProvider>
  )
}
