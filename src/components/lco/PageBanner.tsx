import * as HoverCard from '@radix-ui/react-hover-card'

interface LCOProfileType {
  areaIdList: string[]
  name: string
  instagram: string
  website: string
  report: string
}
const LCO_TEST_DATA: LCOProfileType[] = [{
  areaIdList: ['e519a674-a620-509c-9e86-a246f84a8e40'],
  name: 'Boulder Climbing Community',
  instagram: 'https://www.instagram.com/boulderclimbingcommunity/',
  website: 'https://www.boulderclimbers.org/',
  report: 'https://docs.google.com/forms/d/e/1FAIpQLSfRditFRHJIt7ayZ1SPet2gkl5wh7QF8DnoqRGf1kdzCgegQg/viewform'

}]

interface PageBannerProps {
  pathTokens: string[]
}

export const PageBanner: React.FC<PageBannerProps> = ({ pathTokens }) => {
  const bcc = LCO_TEST_DATA[0]
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <ContentTrigger profile={bcc} />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content sideOffset={10} side='right' align='start' className='z-40'>
          <Card profile={bcc} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

interface ContentProps {
  profile: LCOProfileType
//   className?: string
}
const ContentTrigger: React.FC<ContentProps> = ({ profile }) => {
  const { name, website } = profile
  return (
    <div className='mt-8 bg-area-cue/20 p-6 rounded-box'>
      <div className='mt-2 text-xs text-base-300'>Local climbing organization</div>
      <a className='block mt-2 uppercase decoration-dotted underline-offset-2  underline  font-medium' href={website} target='_blank' rel='noreferrer'>{name}</a>
    </div>
  )
}

const Card: React.FC<ContentProps> = ({ profile }) => {
  const { name, website, instagram } = profile
  return (
    <div className='card w-96 bg-secondary shadow-xl z-50 overflow-clip border-base-200'>
      <div className='card-body'>
        <h2 className='card-title mt-2 uppercase'>{name}</h2>
        <div className='flex gap-4'>
          <a className='badge badge-outline opacity-60' href={website} target='_blank' rel='noreferrer'>website</a>
          <a className='badge badge-outline opacity-60' href={instagram} target='_blank' rel='noreferrer'>instagram</a>
        </div>

      </div>
      <div className='card-actions bg-base-100 justify-end p-4'>
        <button className='btn btn-primary btn-sm opacity-80'>Report bad bolts</button>
      </div>
    </div>
  )
}
