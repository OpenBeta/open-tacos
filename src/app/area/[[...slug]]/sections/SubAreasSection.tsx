import Link from 'next/link'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'
import { AreaList } from 'app/editArea/[slug]/general/components/AreaList'
import { AreaEntityBullet } from '@/components/cues/Entities'
import { AreaType } from '@/js/types'

/**
 * Sub-areas section
 */
export const SubAreasSection: React.FC<{ area: AreaType } > = ({ area }) => {
  const { uuid, children, metadata: { leaf } } = area
  if (leaf) return null
  return (
    <section className='w-full mt-16'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3 className='flex items-center gap-4'><AreaEntityBullet />{children.length} Areas</h3>
        </div>
        <Link href={`/editArea/${uuid}/general#addArea`} target='_new' className='btn btn-sm btn-accent'>
          <PlusCircle size={16} /> New Areas
        </Link>
      </div>

      <hr className='my-6 border-2 border-base-content' />

      <AreaList parentUuid={uuid} areas={children} />
    </section>
  )
}
