import Link from 'next/link'
import CragFinder from './search/CragFinder'
import MobileNavBar from './ui/MobileNavBar'
import { HomeIcon } from '@heroicons/react/outline'
import MobileFilters from './finder/filters/MobileFilters'

export default function MobileAppBar (): JSX.Element {
  return (
    <>
      <MobileNavBar
        branding={<Branding />}
        home={<Home />}
        search={<CragFinder />}
        more={<div>more</div>}
      />
      <MobileFilters />
    </>

  )
}

const Home = (): JSX.Element => {
  return (<Link href='/'><a><HomeIcon /></a></Link>)
}

const Branding = (): JSX.Element => {
  return (
    <Link href='/'>
      <a className='font-semibold text-lg text-primary pt-1'>OpenTacos</a>
    </Link>
  )
}
