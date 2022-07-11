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
        className='max-w-screen-xl gap-x-4'
        backgroundClass={Bar.BG_DARK}
        layoutClass={Bar.GRID3}
        borderBottom
      >
        <div className='flex items-center'>
          <div className='hidden md:block md:w-8 md:h-8'>{branding}</div>
          <div className='md:hidden md:w-12'>{home}</div>
        </div>
        <div className='w-full max-w-md md:mr-4'>
          {search}
        </div>
        <div className='flex items-center gap-x-4 justify-end'>
          {profile}
          <div className='w-12'>{more}</div>
        </div>
      </Bar>
    </header>
  )
}
