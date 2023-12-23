import { Plus } from '@phosphor-icons/react/dist/ssr'
import { ClimbList } from '@/app/editArea/[slug]/general/components/climb/ClimbListForm'
import { AreaType } from '@/js/types'
/**
 * Climb list section
 */
export const ClimbListSection: React.FC<{ area: AreaType, editMode?: boolean }> = ({ area, editMode = false }) => {
  const { uuid, gradeContext, climbs, metadata } = area
  if (!metadata.leaf) return null
  return (
    <section className='w-full'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3 className='flex items-center gap-4'>{climbs.length} Climbs</h3>
        </div>
        {/* Already in the edit dashboard. Don't show the button */}
        {!editMode &&
          <div className='flex items-center gap-2'>
            <a href={`/editArea/${uuid}/manageClimbs`} className='btn btn-sm btn-accent btn-outline'>
              <Plus size={18} weight='bold' /> New Climbs
            </a>
          </div>}
      </div>

      <hr className='mt-2 mb-6 border-2 border-base-content' />

      <ClimbList gradeContext={gradeContext} areaMetadata={metadata} climbs={climbs} editMode={editMode} />
    </section>
  )
}
