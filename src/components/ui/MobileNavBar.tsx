import Bar from './Bar'
interface MNavBarProps {
  branding: JSX.Element
  home: JSX.Element
  search: JSX.Element
  more: JSX.Element
}

export default function MobileNavBar ({ branding, home, search, more }: MNavBarProps): JSX.Element {
  return (
    <header className='lg:hidden'>
      <Bar className='max-w-screen-lg gap-x-8 px-4' backgroundClass='bg-ob-tertiary'>
        <div className='hidden md:block w-12'>{branding}</div>
        <div className='md:hidden w-12'>{home}</div>
        <div className='w-full'>{search}</div>
        <div className='w-12 w-full'>{more}</div>
      </Bar>
    </header>
  )
}
