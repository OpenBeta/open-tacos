import { LinkButton } from '../ui/Button'

export default function DefaultView (): JSX.Element {
  return (
    <div className='flex flex-col gap-y-12 items-center mt-0 md:mt-6 mb-6 bg-base-100 rounded-box py-6'>
      <div className='text-primary font-bold'>Quick edit</div>
      <div className='flex flex-col items-center gap-y-2'>
        <LinkButton href='/edit/addArea' className='btn btn-primary btn-wide'>
          Add New Area
        </LinkButton>
        <div className='text-xs'>Area: a crag, boulder, or a well-known destination</div>
      </div>
      <div className='flex flex-col items-center gap-y-2'>
        <button className='btn btn-secondary btn-wide btn-disabled'>
          Add New climb
        </button>
        <div className='text-xs'>Climb: a route climb or a boulder problem (coming soon)</div>
      </div>
    </div>
  )
}
