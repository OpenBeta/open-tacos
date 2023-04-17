import * as HoverCard from '@radix-ui/react-hover-card'
import { ClimbType } from '../../js/types'
import { LCO_LIST } from './data'
import Tooltip from '../../components/ui/Tooltip'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

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

const findLCOs = (
  lcoList: LCOProfileType[],
  currentPageAncestors: string[]
): LCOProfileType[] => {
  return lcoList.reduce<LCOProfileType[]>((acc, curr) => {
    if (isMyCrag(currentPageAncestors, curr.areaIdList)) {
      acc.push(curr)
    }
    return acc
  }, [])
}

const isMyCrag = (ancestors: string[], myCrags: string[]): boolean =>
  ancestors.some((path) => myCrags.some((myCragId) => myCragId === path))

type PageBannerProps = Pick<ClimbType, 'ancestors'>

/**
 * Display LCO banner if there is one.  An area may have multiple LCOs.
 */
export const PageBanner: React.FC<PageBannerProps> = ({ ancestors }) => {
  const orgs = findLCOs(LCO_LIST, ancestors)
  return (
    <div className='grid pt-6 pb-4 lg:pb-16 lg:pt-16'>
      <div className='col-span-full flex justify-start items-center pb-6'>
        <h3 className='mr-4'>Local climbing organizations</h3>
        <Tooltip content='infos about why lco is important'>
          <InformationCircleIcon className='h-6 w-6' />
        </Tooltip>
      </div>
      <div className=''>
        {orgs.length === 0
          ? (
            <p className='italic text-tertiary-contrast'>
              No organizationa found for this area
            </p>
            )
          : (
              orgs.map((orgProfile) => (
                <IndividualBanner key={orgProfile.id} profile={orgProfile} />
              ))
            )}
      </div>
    </div>
  )
}

const IndividualBanner: React.FC<ContentProps> = ({ profile }) => (
  <>
    <div className='sm:inline-block mr-6 mb-6'>
      <div className='flex items-center bg-light hover:bg-on-hover pl-5 pr-7 rounded-2xl'>
        <img
          className='h-10 w-10'
          src='https://fastly.picsum.photos/id/625/200/200.jpg?hmac=oIwf4IzbglfXYZo-9VXZTHju2-ox3D-Vooeuioav_nw'
          alt='placeholder LCO logo'
        />
        <div className='py-5  pl-4 overflow-hidden'>
          <p className='text-base leading-6'>{profile.name}</p>

          <p className='text-xs underline'>
            <a href={profile.website}>{profile.website}</a>
          </p>
        </div>
      </div>
    </div>
  </>
)

interface ContentProps {
  profile: LCOProfileType
}

//  const ContentTrigger: React.FC<ContentProps> = ({ profile }) => {
//  const { name, website } = profile
//  return (
//    <a
//      className='block uppercase hover:underline font-medium'
//      href={website}
//      target='_blank'
//      rel='noreferrer'
//    >
//      {name}
//    </a>
//  )
// }
