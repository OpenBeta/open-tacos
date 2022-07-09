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
        <div className='flex items-center w-full'>
          <div className='hidden md:block'>{branding}</div>
          <div className='md:hidden'>{home}</div>

          <div className='flex-1 w-full px-2 hidden sm:block'>
            {search}
          </div>

          <div className='sm:hidden flex flex-1 justify-end mr-2'>
            <div className=''>
              {search}
            </div>
          </div>

          {profile}
          <div className='w-12'>{more}</div>
        </div>
      </Bar>
    </header>
  )
}
