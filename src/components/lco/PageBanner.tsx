import * as HoverCard from '@radix-ui/react-hover-card'
import { ClimbType } from '../../js/types'
import { LCO_LIST } from './data'
import { UsersIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
export interface LCOProfileType {
  /** Org unique id  */
  id: string
  /** An array of area IDs under the org care */
  areaIdList: string[]
  /** Official name */
  name: string
  /** IG Url */
  instagram: string
  /** Official website */
  website: string
  /** Bad hardware report form url */
  report?: string
  /** Donation url */
  donation?: string
}

const findLCOs = (lcoList: LCOProfileType[], currentPageAncestors: string[]): LCOProfileType[] => {
  return lcoList.reduce<LCOProfileType[]>((acc, curr) => {
    if (isMyCrag(currentPageAncestors, curr.areaIdList)) {
      acc.push(curr)
    }
    return acc
  }, [])
}

const isMyCrag = (ancestors: string[], myCrags: string[]): boolean => ancestors.some(path => myCrags.some(myCragId => myCragId === path))

type PageBannerProps = Pick<ClimbType, 'ancestors'>

/**
 * Display LCO banner if there is one.  An area may have multiple LCOs.
 */
export const PageBanner: React.FC<PageBannerProps> = ({ ancestors }) => {
  const orgs = findLCOs(LCO_LIST, ancestors)
  if (orgs.length === 0) return null
  return (
    <>
      {orgs.map(orgProfile => <IndividualBanner key={orgProfile.id} profile={orgProfile} />)}
    </>
  )
}

const IndividualBanner: React.FC<ContentProps> = ({ profile }) => (
  <>
    <Card profile={profile} />
  </>
)

interface ContentProps {
  profile: LCOProfileType
}
const ContentTrigger: React.FC<ContentProps> = ({ profile }) => {
  const { name, website } = profile
  return (
    <a
      className='block uppercase hover:underline font-medium'
      href={website}
      target='_blank'
      rel='noreferrer'
    >
      {name}
    </a>
  )
}

const Card: React.FC<ContentProps> = ({ profile }) => {
  const { name, website, instagram, report, donation } = profile
  return (

    <div className='grid md:grid-cols-6 px-11 pt-11 pb-16 gap-2 md:gap-4 sm:max-w-sm md:max-w-lg bg-white rounded-lg'>

      <div className=' md:col-span-1'>
        <UsersIcon className='h-12 w-12 rounded-lg border-slate-100 border' />
      </div>

      <div className='gap-10 md:col-span-5'>
        <p className='text-base-content/60 font-semibold'>Local Climbing Organization</p>
        <h2 className='card-title my-2 uppercase'>{name}</h2>
        <a
          className='underline pb-5'
          href={website}
          target='_blank'
          rel='noreferrer'
        >
          <p className='text-sm'>{website}</p>
        </a>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
          reiciendis, illo alias blanditiis corporis temporibus a. Sit animi
          accusamus laborum minima voluptatibus perspiciatis quos vitae,
          temporibus, ea quam fugit eos.
        </p>
        <div className='border-t border-b divide-y'>
          <div className='flex felx-row flex-wrap justify-between pt-4 md:pt-6'>
            <a
              className='underline pb-4'
              href={instagram}
              target='_blank'
              rel='noreferrer'
            >
              contact info
            </a>
            <a
              className='underline pb-4'
              href={instagram}
              target='_blank'
              rel='noreferrer'
            >
              instagram
            </a>
            <a
              className='underline pb-4'
              href={instagram}
              target='_blank'
              rel='noreferrer'
            >
              twitter
            </a>
            <a
              className='underline pb-4'
              href={instagram}
              target='_blank'
              rel='noreferrer'
            >
              facebook
            </a>
          </div>
        </div>
        <div className='space-y-4 py-6'>
          <div>
            {donation != null && (
              <a
                className='btn btn-primary opacity-60 '
                href={donation}
                target='_blank'
                rel='noreferrer'
              >
                Make a Donation <ArrowUpRightIcon className='ml-2 w-4 h-4' />
              </a>
            )}
          </div>
          <div className='card-actions '>
            <a
              className='btn btn-primary opacity-80 bg-red-500 border-0'
              href={report}
              target='_blank'
              rel='noreferrer'
            >
              Report Hardware Replacement{' '}
              <ArrowUpRightIcon className='ml-2 w-4 h-4' />
            </a>
          </div>
        </div>
      </div>
    </div>

  )
}

// const Card: React.FC<ContentProps> = ({ profile }) => {
//  const { name, website, instagram, report, donation } = profile
//  return (
//    <div className='card w-96 bg-secondary shadow-xl z-50 overflow-clip border-base-200'>
//      <div className='p-8 pt-10'>
//        <h2 className='card-title my-2 uppercase'>{name}</h2>
//        <div className='flex gap-4'>
//          <a className='badge badge-outline opacity-60' href={website} target='_blank' rel='noreferrer'>website</a>
//          <a className='badge badge-outline opacity-60' href={instagram} target='_blank' rel='noreferrer'>instagram</a>
//          {donation != null && <a className='badge opacity-60 px-4' href={donation} target='_blank' rel='noreferrer'>Donate</a>}
//        </div>
//      </div>
//      <div className='card-actions bg-base-100 flex justify-end p-4'>
//        <a className='btn btn-primary btn-sm opacity-80' href={report} target='_blank' rel='noreferrer'>Report bad bolts</a>
//      </div>
//    </div>
//  )
// }
