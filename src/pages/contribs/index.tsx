import { NextPage } from 'next'
import Link from 'next/link'

const ContribsHome: NextPage<{}> = () => {
  return (
    <div data-theme='light' className='max-w-md px-4 pb-16 xl:py-24 mx-auto'>
      <div className='flex flex-col gap-y-12 items-center'>
        <div className='text-primary font-bold'>I want to add</div>
        <div className='flex flex-col items-center gap-y-2'>
          <button className='btn btn-primary btn-wide'>
            New area
          </button>
          <div className='text-xs'>Area: a crag, boulder, or a well-known destination</div>
        </div>
        <div className='flex flex-col items-center gap-y-2'>
          <button className='btn btn-secondary btn-wide'>
            New climb
          </button>
          <div className='text-xs'>Climb: a route climb or a boulder problem (coming soon)</div>
        </div>
        <div className='flex flex-col items-center gap-y-2'>
          <Link href='/contribs/addCountry'>
            <a>
              <button className='btn btn-outline btn-wide'>

                New country

              </button>
            </a>
          </Link>
          <div className='text-xs'>Less common</div>
        </div>
      </div>
    </div>
  )
}

export default ContribsHome
