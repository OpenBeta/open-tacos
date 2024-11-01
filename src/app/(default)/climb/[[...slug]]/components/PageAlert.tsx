import Link from 'next/link'
import { Bulldozer } from '@phosphor-icons/react/dist/ssr'

export const PageAlert: React.FC<{ id: string }> = ({ id }) => (
  <div className='alert alert-warning text-md flex justify-center'>
    <div className='flex gap-1'>
      <Bulldozer size={24} className='mr-2' />
      We're giving this page a facelift.
      <Link href={`/climbs/${id}`} className='underline font-semibold'>Visit the previous version</Link>
      to make edits.
    </div>
  </div>)
