import { LinkButton } from '../ui/Button'

export default function DefaultView (): JSX.Element {
  return (
    <div className='flex flex-col gap-y-12 items-center mt-0 md:mt-6 mb-6 bg-base-100 rounded-box'>
      <div className='mt-6 text-primary font-bold'>I want to add</div>
      <div className='flex flex-col items-center gap-y-2'>
        <LinkButton href='/contribs/addArea' className='btn btn-primary btn-wide'>
          New Area
        </LinkButton>
        <div className='text-xs'>Area: a crag, boulder, or a well-known destination</div>
      </div>
      <div className='flex flex-col items-center gap-y-2'>
        <button className='btn btn-secondary btn-wide btn-disabled'>
          New climb
        </button>
        <div className='text-xs'>Climb: a route climb or a boulder problem (coming soon)</div>
      </div>
      <div className='flex flex-col items-center gap-y-2'>
        <LinkButton href='/contribs/addCountry' className='btn btn-outline btn-wide'>
          New country
        </LinkButton>
        <div className='text-xs'>Less common</div>
      </div>
    </div>
  )
}
