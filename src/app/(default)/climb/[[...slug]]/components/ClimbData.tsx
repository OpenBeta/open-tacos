import { ArrowsVertical } from '@phosphor-icons/react/dist/ssr'

import TickButton from '@/components/users/TickButton'
import RouteGradeChip from '@/components/ui/RouteGradeChip'
import RouteTypeChips from '@/components/ui/RouteTypeChips'
import { ArticleLastUpdate } from '@/components/edit/ArticleLastUpdate'
import { ClimbType, AreaType } from '@/js/types'
import Grade from '@/js/grades/Grade'
import { removeTypenameFromDisciplines } from '@/js/utils'

export const ClimbData: React.FC<ClimbType & Pick<AreaType, 'gradeContext'> & { isBoulder: boolean }> = (props) => {
  const { id, name, type, safety, length, grades, fa: legacyFA, authorMetadata, gradeContext, isBoulder } = props
  const sanitizedDisciplines = removeTypenameFromDisciplines(type)

  const gradeStr = new Grade(
    gradeContext,
    grades,
    sanitizedDisciplines,
    isBoulder
  ).toString()
  return (
    <>
      <h1 className='text-4xl md:text-5xl mr-10'>
        {name}
      </h1>
      <div className='mt-6'>
        <div className='flex items-center space-x-2 w-full'>
          {gradeStr != null && (
            <RouteGradeChip gradeStr={gradeStr} safety={safety} />
          )}
          <RouteTypeChips type={type} />
        </div>

        {length !== -1 && (
          <div className='mt-6 inline-flex items-center justify-left border-2 border-neutral/80 rounded'>
            <ArrowsVertical className='h-5 w-5' />
            <span className='bg-neutral/80 text-base-100 px-2 text-sm'>{length}m</span>
          </div>
        )}
        {/* {editMode && <TotalLengthInput />} */}

        <div className='mt-6'>
          <div className='text-sm font-medium text-base-content'>{trimLegacyFA(legacyFA)}</div>
        </div>

        {(authorMetadata.createdAt != null || authorMetadata.updatedAt != null) && (
          <div className='mt-8  border-t border-b'>
            <ArticleLastUpdate {...authorMetadata} />
          </div>
        )}

        {/* TODO: Hide the TickButton in editMode */}
        <div className='mt-8'>
          <TickButton climbId={id} name={name} grade={gradeStr} climbType={sanitizedDisciplines} />
        </div>
      </div>
    </>
  )
}

const trimLegacyFA = (s: string): string => {
  if (s == null || s.trim() === '') return 'FA Unknown'
  if (s.startsWith('FA')) return s
  return 'FA ' + s
}
