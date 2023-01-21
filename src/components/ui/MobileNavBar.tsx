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
        className='max-w-screen-xl'
        backgroundClass={Bar.BG_DARK}
        layoutClass={Bar.JUSTIFY_BETWEEN}
        borderBottom
      >
        <div className='hidden md:inline-flex items-center'>
          {branding}
        </div>
        <div className='inline-flex md:hidden md:w-12'>{home}</div>
        {search}
        {profile}
        {more}
      </Bar>
    </header>
  )
}
