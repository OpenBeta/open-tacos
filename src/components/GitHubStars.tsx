import useSWRImmutable from 'swr/immutable'

import GithubIcon from '../assets/icons/github.inline.svg'

/**
 * Render GitHub stargazers button
 */
const GitHubStars: React.FC = () => {
  const { data } = useSWRImmutable<{ stargazers_count: number }>('https://api.github.com/repos/openbeta/open-tacos', fetcher)

  return (
    <a className='no-animation transition-none flex items-center border rounded-btn px-2 py-1 text-xs font-light' href='https://github.com/OpenBeta/open-tacos'>
      <GithubIcon className='w-4 h-4' />&nbsp;Star | {data?.stargazers_count}
    </a>
  )
}

export default GitHubStars

const fetcher = async (url: string): Promise<any> => await fetch(url).then(async res => await res.json())
