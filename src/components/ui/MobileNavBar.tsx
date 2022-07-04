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
    <header className='xl:hidden relative z-20'>
      <Bar
        className='max-w-screen-xl gap-x-8 px-4'
        backgroundClass={Bar.BG_DARK}
        borderBottom
      >
        <div className='hidden md:block w-8 h-8'>{branding}</div>
        <div className='md:hidden w-12'>{home}</div>
        {search}
        {profile}
        <div className='w-12'>{more}</div>
      </Bar>
    </header>
  )
}
