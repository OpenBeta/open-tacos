import { RecentEdits } from './components/RecentEdits'
import { RecentTags } from './components/RecentTags'
import { USAToC } from './components/USAToC'

export default async function Home (): Promise<any> {
  return (
    <div className='mt-16 w-full flex flex-col gap-y-24'>
      <div className='pl-4 lg:grid lg:grid-cols-3'>
        <div className='col-span-2 bg-blue-200 rounded-box p-10'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

        </div>
        <div className='lg:overflow-y-auto lg:h-[800px] w-full'>
          <RecentEdits />
        </div>
      </div>
      <RecentTags />
      <USAToC />
    </div>
  )
}
