import Link from 'next/link'
import { Bulldozer } from '@phosphor-icons/react/dist/ssr'

export const PageAlert: React.FC<{ id: string }> = ({ id }) => (
  <div className='alert alert-warning text-md flex justify-center'>
    <div className='flex flex-col lg:flex-row items-center gap-2'>
      <div className='flex items-center'>
        <Bulldozer size={24} className='mr-2' />
        We're giving this page a facelift!
      </div>
      <Link href={`/climbs/${id}`} className='underline font-semibold'>Visit the previous version</Link>
      to make edits.
    </div>
  </div>)
