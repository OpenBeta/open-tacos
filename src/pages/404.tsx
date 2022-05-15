import React from 'react'
import { getNavBarOffset } from '../components/Header'
import Layout from '../components/layout'
import useResponsive from '../js/hooks/useResponsive'

function NotFoundPage (): JSX.Element {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const navbarOffset = getNavBarOffset({ isMobile, isTablet, isDesktop })
  return (
    <Layout contentContainerClass=''>
      <div className='w-full  bg-gray-50 p-2' style={{ height: `calc(100vh - ${navbarOffset}px)` }}>
        <div className='flex items-center align-middle justify-center h-full'>
          <div className='text-center mt-8'>
            <div className='flex justify-center'>
              <div className='bg-yellow-100 italic mb-2'>
                404
              </div>
            </div>

            <div className='text-4xl md:text-7xl tracking-wide font-bold px-2 py-1'>
              Page not found
            </div>

            <div className='mt-2'>
              You'll have to look somewhere else, it's not here
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage
