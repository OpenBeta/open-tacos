import * as HoverCard from '@radix-ui/react-hover-card'
import { ClimbType } from '../../js/types'
import { LCO_LIST } from './data'
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
  return (
    <div className='grid pb-16 pt-16'>
      <div className='col-span-full flex justify-start pb-6'>
        <h3>Local climbing organizations</h3>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='h-6 w-6'
        >
          <path
            fill-rule='evenodd'
            d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z'
            clip-rule='evenodd'
          />
        </svg>
      </div>
      <div className='flex-auto'>

        {orgs.length === 0
          ? (
              <p className='italic text-tertiary-contrast'>No organizationa found for this area</p>
          ) 
        : (orgs.map((orgProfile) => (
          <IndividualBanner key={orgProfile.id} profile={orgProfile} />
        )))
        }
      </div>
    </div>
  )
}



const IndividualBanner: React.FC<ContentProps> = ({ profile }) => (
  <>
    <div className='inline-block'>
      <div className='flex items-center bg-slate-50 pl-5 pr-7 rounded-2xl'>
        <img
          className='h-10 w-10'
          src='https://fastly.picsum.photos/id/625/200/200.jpg?hmac=oIwf4IzbglfXYZo-9VXZTHju2-ox3D-Vooeuioav_nw'
          alt='default LCO logo'
        />
        <div className='py-5  pl-4'>
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


