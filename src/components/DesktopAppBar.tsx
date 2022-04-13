import Image from 'next/image'
import DesktopNavBar from './ui/DesktopNavBar'
import ClimbSearch from './search/ClimbSearch'
import DesktopFilterBar from './finder/filters/DesktopFilterBar'
interface DesktopAppBarProps {
  expanded: boolean
  onExpandSearchBox: Function
  onClose: Function
}

export default function DesktopAppBar ({ expanded, onExpandSearchBox, onClose }: DesktopAppBarProps): JSX.Element {
  return (
    <>
      <DesktopNavBar
        expanded={expanded}
        branding={
          <a href='/' className='inline-flex flex-rows justify-start items-center md:gap-x-2'>
            <Image className='align-middle' src='/tortilla.png' height={32} width={32} />
            <span className='hidden md:inline-flex items-center font-semibold text-xl lg:text-2xl text-custom-primary pt-1'>OpenTacos</span>
          </a>
      }
        search={
          <ClimbSearch
            expanded={expanded}
            onClick={onExpandSearchBox}
            onClickOutside={onClose}
          />
      }
        navList={navList}
      />
      <DesktopFilterBar />
    </>
  )
}

const navList = [
  {
    route: '/about',
    title: 'About'
  },
  {
    route: 'https://docs.openbeta.io',
    title: 'Docs'
  },
  {
    route: 'https://discord.gg/2A2F6kUtyh',
    title: 'Discord',
    cta: true
  }
]
