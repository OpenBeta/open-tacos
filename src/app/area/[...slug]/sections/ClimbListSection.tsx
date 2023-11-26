import Link from 'next/link'
import { Plus } from '@phosphor-icons/react/dist/ssr'
import { ClimbList } from '@/app/editArea/[slug]/general/components/climb/ClimbListForm'
import { AreaType } from '@/js/types'
/**
 * Sub-areas section
 */
export const ClimbListSection: React.FC<{ area: AreaType }> = ({ area }) => {
  const { uuid, gradeContext, climbs, metadata } = area
  if (!metadata.leaf) return null
  return (
    <section className='w-full mt-16'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3 className='flex items-center gap-4'>{climbs.length} Climbs</h3>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm italic'>Coming soon:</span>
          <Link href={`/editArea/${uuid}/general#addArea`} className='btn-disabled btn btn-sm'>
            <Plus size={18} weight='bold' /> New Climbs
          </Link>
        </div>
      </div>

      <hr className='my-6 border-2 border-base-content' />

      <ClimbList gradeContext={gradeContext} areaMetadata={metadata} climbs={climbs} />
    </section>
  )
}
