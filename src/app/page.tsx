import { RecentTags } from './components/RecentTags'
import { USAToC } from './components/USAToC'

export default async function Home (): Promise<any> {
  return (
    <div className='mt-32 w-full'>
      <RecentTags />
      <USAToC />
    </div>
  )
}
