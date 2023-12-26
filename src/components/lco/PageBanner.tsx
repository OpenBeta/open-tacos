'use client'
import { HandHeart, ArrowUpRight, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { OrganizationType } from '../../js/types'
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

interface PageBannerProps {orgs: OrganizationType[]}

const getLcoList = (orgs: OrganizationType[]): LCOProfileType[] => {
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
    <div>
      <div className='flex items-center flex-wrap gap-2 '>
        <h3 className='font-bold'>Local climbing organizations</h3>
        <span className='text-xs'>
          [
          <a
            href='https://openbeta.substack.com/p/openbeta-and-lcos'
            target='_blank' rel='noreferrer' className='hover:underline'
          >
            Learn more
          </a>
          ]
        </span>
      </div>

      <div className='mt-3 flex flex-wrap gap-6'>
        {lcoList.length === 0
          ? <AddLCOCallToAction />
          : (
              lcoList.map((orgProfile) => (
                <LcoCardTrigger key={orgProfile.id} profile={orgProfile} />
              ))
            )}
      </div>
    </div>
  )
}

const LcoCardTrigger: React.FC<{ profile: LCOProfileType }> = ({ profile }): JSX.Element => {
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
    <div className='card card-compact w-80 shadow-lg card-bordered'>
      <div className='card-body overflow-hidden'>
        <div className='flex items-center gap-3'>
          <div className='avatar cursor-pointer'>
            <HandHeart size={32} weight='duotone' className='border rounded border-base-300 p-0.5' />
          </div>
          <div className='overflow-hidden'>
            <p className='text-base leading-6 cursor-pointer truncate'>{profile.name}</p>
            <p className='text-xs underline text-secondary truncate'>
              <a href={profile.website} target='_blank' rel='noreferrer' onClick={e => e.stopPropagation()}>{profile.website}</a>
            </p>
          </div>
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
    <div className='card card-bordered'>
      <div className='card-body'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='avatar'>
            <HandHeart size={48} className='border rounded-btn p-1' />
          </div>
          <div>
            <p className='text-secondary font-semibold'>Local Climbing Organization</p>
            <h3 className='card-title mt-4 uppercase'>{name}</h3>
            {website != null && (
              <a
                className='underline text-xs text-secondary'
                href={website}
                target='_blank'
                rel='noreferrer'
              >
                {website}
              </a>
            )}
            {description != null && (
              <p className='text-base mt-2'>
                {description}
              </p>
            )}

            <SocialLinks email={email} facebook={facebook} instagram={instagram} />

            <div className='card-actions flex flex-col gap-4'>
              {donation != null && (
                <a
                  className='btn btn-primary gap-2'
                  href={donation}
                  target='_blank'
                  rel='noreferrer'
                >
                  Make a Donation <ArrowUpRight />
                </a>
              )}
              {report != null && (
                <a
                  className='btn btn-accent btn-solid gap-2'
                  href={report}
                  target='_blank'
                  rel='noreferrer'
                >
                  Report Hardware Replacement{' '}
                  <ArrowUpRight />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SocialLinks: React.FC<{ email?: string, facebook?: string, instagram?: string }> = ({ email, facebook, instagram }) => {
  if (email == null && facebook == null && instagram == null) return null

  return (
    <div className='px-4 border-t border-b flex items-center flex-wrap gap-8 pt-4 py-6 my-6'>
      {email != null && (
        <a
          className='underline'
          href={`mailto:${email}`}
          target='_blank'
          rel='noreferrer'
        >
          contact info
        </a>
      )}
      {instagram != null && (
        <a
          className='underline'
          href={instagram}
          target='_blank'
          rel='noreferrer'
        >
          instagram
        </a>
      )}
      {facebook != null && (
        <a
          className='underline'
          href={facebook}
          target='_blank'
          rel='noreferrer'
        >
          facebook
        </a>
      )}
    </div>
  )
}

const AddLCOCallToAction: React.FC = () => {
  return (
    <div>
      <p className='italic'>No organizations found for this area.</p>
      <div className='alert mt-2'>
        <p className='text-sm'>
          Do you know a great local organization?&nbsp;
          <a
            href='https://openbeta.substack.com/p/openbeta-and-lcos'
            target='_blank' rel='noreferrer'
            className='link-dotted inline-flex items-center gap-1'
          >
            Let us know <ArrowRight />
          </a>
        </p>
      </div>
    </div>
  )
}
