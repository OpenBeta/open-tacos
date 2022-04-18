import Link from 'next/link'
import CragFinder from './search/CragFinder'
import MobileNavBar from './ui/MobileNavBar'
import { HomeIcon } from '@heroicons/react/outline'
import MobileFilterBar from './finder/filters/MobileFilterBar'

export default function MobileAppBar (): JSX.Element {
  return (
    <>
      <MobileNavBar
        branding={<Branding />}
        home={<Home />}
        search={<CragFinder />}
        more={<div>&nbsp;</div>}
      />
      <MobileFilterBar />
    </>

  )
}

const Home = (): JSX.Element => {
  return (<Link href='/'><a><HomeIcon className='text-primary' /></a></Link>)
}

const Branding = (): JSX.Element => {
  return (
    <Link href='/'>
      <a className='font-semibold text-lg text-primary pt-1'>OpenTacos</a>
    </Link>
  )
}
