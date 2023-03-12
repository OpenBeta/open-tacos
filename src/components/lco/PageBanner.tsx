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
  if (orgs.length === 0) return null
  return (
    <div className='mt-8 bg-area-cue/20 p-6 rounded-box'>
      <div className='mt-2 mb-1 text-xs text-base-300'>Local climbing organizations</div>
      <div className='flex flex-col'>
        {orgs.map(orgProfile => <IndividualBanner key={orgProfile.id} profile={orgProfile} />)}
      </div>
    </div>
  )
}

const IndividualBanner: React.FC<ContentProps> = ({ profile }) => (
  <HoverCard.Root openDelay={300}>
    <HoverCard.Trigger>
      <ContentTrigger profile={profile} />
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content sideOffset={10} side='top' className='z-40'>
        <Card profile={profile} />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
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
    <div className='card w-96 bg-secondary shadow-xl z-50 overflow-clip border-base-200'>
      <div className='p-8 pt-10'>
        <h2 className='card-title my-2 uppercase'>{name}</h2>
        <div className='flex gap-4'>
          <a className='badge badge-outline opacity-60' href={website} target='_blank' rel='noreferrer'>website</a>
          <a className='badge badge-outline opacity-60' href={instagram} target='_blank' rel='noreferrer'>instagram</a>
          {donation != null && <a className='badge opacity-60 px-4' href={donation} target='_blank' rel='noreferrer'>Donate</a>}
        </div>
      </div>
      <div className='card-actions bg-base-100 flex justify-end p-4'>
        <a className='btn btn-primary btn-sm opacity-80' href={report} target='_blank' rel='noreferrer'>Report bad bolts</a>
      </div>
    </div>
  )
}
