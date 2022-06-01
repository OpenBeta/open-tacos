import Bar from './Bar'
interface MNavBarProps {
  branding: JSX.Element
  home: JSX.Element
  search: JSX.Element
  profile: JSX.Element
  more: JSX.Element
}

export default function MobileNavBar ({ branding, home, search, profile, more }: MNavBarProps): JSX.Element {
  return (
    <header className='xl:hidden'>
      <Bar className='max-w-screen-xl gap-x-8 px-4' backgroundClass='bg-default'>
        <div className='hidden md:block w-12'>{branding}</div>
        <div className='md:hidden w-12'>{home}</div>
        <div className='w-full'>{search}</div>
        <div className='w-12'>{profile}</div>
        <div className='w-12'>{more}</div>
      </Bar>
    </header>
  )
}
