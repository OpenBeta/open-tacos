import { ReactNode } from 'react'
import { NavBar } from './NavBar'

interface AccountLayoutProps {
  form: ReactNode
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ form }) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 lg:justify-center'>
      <div className='min-h-screen flex bg-accent/80 w-full lg:justify-end pl-4'>
        <NavBar />
      </div>
      <div className='w-full min-h-screen px-4 lg:px-6 py-8 lg:pt-24 flex flex-col'>
        {form}
      </div>
    </div>
  )
}
