// import * as HoverCard from '@radix-ui/react-hover-card'
import { OrganizationType } from '../../js/types'
import Tooltip from '../../components/ui/Tooltip'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { UsersIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'

export interface LCOProfileType {
  /** Org unique id  */
  id: string
  /** An array of area IDs under the org care */
  areaIdList: string[]
  /** Official name */
  name: string
  description?: string
  email?: string
  facebook?: string
  /** IG Url */
  instagram?: string
  /** Official website */
  website?: string
  /** Bad hardware report form url */
  report?: string
  /** Donation url */
  donation?: string
}

interface PageBannerProps{orgs: OrganizationType[]}

const getLcoList = (orgs): LCOProfileType[] => {
  return orgs.filter(org => org.orgType === 'LOCAL_CLIMBING_ORGANIZATION')
    .map(org => ({
      id: org.orgId,
      areaIdList: org.associatedAreaIds ?? [],
      name: org.displayName,
      description: org.content?.description,
      email: org.content?.email,
      website: org.content?.website,
      facebook: org.content?.facebookLink,
      instagram: org.content?.instagramLink,
      report: org.content?.hardwareReportLink,
      donation: org.content?.donationLink
    }))
}
/**
 * Display LCO banner if there is one.  An area may have multiple LCOs.
 */
export const PageBanner: React.FC<PageBannerProps> = ({ orgs }) => {
  const lcoList = getLcoList(orgs)

  return (
    <div className='grid pt-6 pb-4 lg:pb-16 lg:pt-16'>
      <div className='col-span-full flex justify-start items-center pb-6'>
        <h3 className='mr-4'>Local climbing organizations</h3>
        <Tooltip content={
          <p>Learn more about our&nbsp;
            <a href='https://openbeta.substack.com/p/openbeta-and-lcos' target='_blank' rel='noreferrer' className='underline'>
              initiative
            </a>.
          </p>
        }
        >
          <InformationCircleIcon className='h-6 w-6' />
        </Tooltip>
      </div>
      <div>
        {lcoList.length === 0
          ? (
            <p className='italic text-base-content/60'>
              No organizations found for this area
            </p>
            )
          : (
              lcoList.map((orgProfile) => (
                <LcoCardTrigger key={orgProfile.id} profile={orgProfile} />
              ))
            )}
      </div>
    </div>
  )
}

const LcoCardTrigger = ({ profile }): JSX.Element => {
  return (
    <MobileDialog modal>
      <IndividualBanner profile={profile} />
      <DialogContent>
        <LcoCard profile={profile} />
      </DialogContent>
    </MobileDialog>
  )
}

const IndividualBanner: React.FC<ContentProps> = ({ profile }) => (
  <DialogTrigger asChild className='flex flex-row items-center gap-4'>
    <div className='sm:inline-block mr-6 mb-6'>
      <div className='flex items-center bg-light hover:bg-on-hover pl-5 pr-7 rounded-2xl'>
        <UsersIcon className='h-10 w-10' />
        <div className='py-5  pl-4 overflow-hidden'>
          <p className='text-base leading-6'>{profile.name}</p>
          <p className='text-xs underline'>
            <a href={profile.website} target='_blank' rel='noreferrer'>{profile.website}</a>
          </p>
        </div>
      </div>
    </div>
  </DialogTrigger>
)

interface ContentProps {
  profile: LCOProfileType
}

const LcoCard: React.FC<ContentProps> = ({ profile }) => {
  const { name, description, email, website, facebook, instagram, report, donation } = profile
  return (

    <div className='grid md:grid-cols-6 px-11 pt-11 pb-16 gap-2 md:gap-4 bg-white rounded-lg'>

      <div className='md:col-span-1'>
        <UsersIcon className='h-12 w-12 rounded-lg border-slate-100 border' />
      </div>

      <div className='gap-10 md:col-span-5'>
        <p className='text-base-content/60 font-semibold'>Local Climbing Organization</p>
        <h2 className='card-title my-2 uppercase'>{name}</h2>
        {website != null && (
          <a
            className='underline pb-5'
            href={website}
            target='_blank'
            rel='noreferrer'
          >
            <p className='text-sm'>{website}</p>
          </a>
        )}
        {description != null && (
          <p className='whitespace-pre-line'>
            {description}
          </p>
        )}
        <div className={email == null && instagram == null && facebook == null ? ('hidden') : ('border-t border-b divide-y')}>
          <div className='flex felx-row flex-wrap justify-between pt-4 md:pt-6'>
            {email != null && (
              <a
                className='underline pb-4'
                href={`mailto:${email}`}
                target='_blank'
                rel='noreferrer'
              >
                contact info
              </a>
            )}
            {instagram != null && (
              <a
                className='underline pb-4'
                href={instagram}
                target='_blank'
                rel='noreferrer'
              >
                instagram
              </a>
            )}
            {facebook != null && (
              <a
                className='underline pb-4'
                href={facebook}
                target='_blank'
                rel='noreferrer'
              >
                facebook
              </a>
            )}
          </div>
        </div>
        <div className='space-y-4 py-6'>
          <div>
            {donation != null && (
              <a
                className='btn btn-primary btn-outline'
                href={donation}
                target='_blank'
                rel='noreferrer'
              >
                Make a Donation <ArrowUpRightIcon className='ml-2 w-4 h-4' />
              </a>
            )}
          </div>
          {report != null && (
            <div className='card-actions '>
              <a
                className='btn btn-primary btn-solid'
                href={report}
                target='_blank'
                rel='noreferrer'
              >
                Report Hardware Replacement{' '}
                <ArrowUpRightIcon className='ml-2 w-4 h-4' />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}
