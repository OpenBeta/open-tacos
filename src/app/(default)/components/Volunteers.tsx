import { CodeContributorsAction } from './LandingCTA'
import { SectionContainer, Width } from './ui/SectionContainer'

const url = 'https://raw.githubusercontent.com/OpenBeta/open-tacos/develop/.all-contributorsrc'

/**
 * Abbreviated GH profile
 */
interface GithubProfile {
  login: string
  name: string
  avatar_url: string
  profile: string
  contributions: string[]
}
/**
 * List code contributors & volunteers by loading contributor list
 * managed by all-contributors bot.
 */
export const Volunteers: React.FC = async () => {
  const res = await fetch(url)
  const { contributors }: { contributors: GithubProfile[] } = await res.json()
  return (
    <SectionContainer
      width={Width.compact}
      className='border rounded-box bg-base-200/20'
      header={
        <div className='flex items-center gap-6'>
          <h2 className='text-base-content'>Volunteers</h2>
          <span className='mt-0.5 text-sm'>Total: {new Intl.NumberFormat().format(contributors.length)}</span>
        </div>
      }
    >
      <div className='mb-8 max-w-lg'>
        As an open source project, OpenBeta's success is thanks to a diverse group of volunteer contributors, many of whom are not even rock climbers. We deeply appreciate their vital role in shaping OpenBeta.
      </div>
      <div className='columns-3xs gap-x-4'>
        {contributors.reverse().map(profile => <Profile key={profile.login} {...profile} />)}
      </div>
      <div className='pt-8 lg:pt-12 flex items-center gap-6'>
        <CodeContributorsAction />
      </div>
    </SectionContainer>
  )
}

const Profile: React.FC<GithubProfile> = ({
  name,
  /* eslint-disable-next-line */
  avatar_url,
  login
}) => (
  <a
    className='flex items-center gap-2 mb-4 rounded-box overflow-hidden border w-fit bg-base-100 shadow'
    href={`https://github.com/${login}`}
  >
    <div className='avatar'>
      <div className='w-8 rounded-box'>
        <img loading='lazy' src={avatar_url} alt={name} />
      </div>
    </div>
    <div className='text-sm uppercase text-base-content pr-4'>{name}</div>
  </a>)
