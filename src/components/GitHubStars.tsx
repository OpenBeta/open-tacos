import useSWRImmutable from 'swr/immutable'

import GithubIcon from '../assets/icons/github.inline.svg'

/**
 * Render GitHub stargazers button
 */
const GitHubStars: React.FC = () => {
  const { data } = useSWRImmutable<{ stargazers_count: number}>('https://api.github.com/repos/openbeta/open-tacos', fetcher)

  return (
    <a className='no-animation transition-none btn btn-sm btn-info' href='https://github.com/OpenBeta/open-tacos'>
      <GithubIcon className='w-5 h-5' /> Star  <span className='px-2 py-1 backdrop-brightness-75 rounded'>{data?.stargazers_count}</span>
    </a>
  )
}

export default GitHubStars

const fetcher = async (url: string): Promise<any> => await fetch(url).then(async res => await res.json())
