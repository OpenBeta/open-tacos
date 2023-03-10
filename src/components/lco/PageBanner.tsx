import * as HoverCard from '@radix-ui/react-hover-card'
import { ClimbType } from '../../js/types'

interface LCOProfileType {
  id: string
  areaIdList: string[]
  name: string
  instagram: string
  website: string
  report?: string
  donation?: string
}

const LCO_LIST: LCOProfileType[] = [
  {
    id: 'a791edd2-6a19-4f12-b69d-cbd499fed81f',
    areaIdList: ['e519a674-a620-509c-9e86-a246f84a8e40'],
    name: 'Boulder Climbing Community',
    instagram: 'https://www.instagram.com/boulderclimbingcommunity/',
    website: 'https://www.boulderclimbers.org/',
    report: 'https://docs.google.com/forms/d/e/1FAIpQLSfRditFRHJIt7ayZ1SPet2gkl5wh7QF8DnoqRGf1kdzCgegQg/viewform',
    donation: 'https://secure.givelively.org/donate/boulder-climbing-community/donation'
  }, {
    id: '8801b124-ab19-4b66-a292-738dc56e446a',
    areaIdList: ['c80d3abd-beab-5467-a559-edee707f68bd'],
    name: 'Portland Area Climbers Coalition',
    instagram: 'https://www.instagram.com/portlandclimbing/',
    website: 'https://www.oregonclimbers.org/',
    report: 'https://forms.gle/BofUZFFhF6Ann1oZ7'
  }
]

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

export const PageBanner: React.FC<PageBannerProps> = ({ ancestors }) => {
  const orgs = findLCOs(LCO_LIST, ancestors)
  return (
    <div className='mt-8 bg-area-cue/20 p-6 rounded-box'>
      <div className='mt-2 text-xs text-base-300'>Local climbing organizations</div>
      <div className='flex flex-col'>
        {orgs.map(orgProfile => <IndividualBanner key={orgProfile.id} profile={orgProfile} />)}
      </div>
    </div>
  )
}

const IndividualBanner: React.FC<ContentProps> = ({ profile }) => (
  <HoverCard.Root openDelay={400}>
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
      <div className='card-body'>
        <h2 className='card-title mt-2 uppercase'>{name}</h2>
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
