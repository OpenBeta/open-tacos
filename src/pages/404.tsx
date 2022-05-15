import React from 'react'
import Header from '../components/Header'

function NotFoundPage (): JSX.Element {
  return (
    <>
      <div className='absolute w-full h-screen bg-gray-50 overflow-hidden p-2'>
        <div className='flex items-center align-middle justify-center h-screen'>
          <div className='text-center mt-8'>
            <div className='flex justify-center'>
              <div className='bg-yellow-100 italic mb-2'>
                404
              </div>
            </div>

            <div className='bg-white text-4xl md:text-7xl tracking-wide font-bold px-2 py-1'>
              Page not found
            </div>

            <div className='mt-2 bg-white'>
              You'll have to look somewhere else, it's not here
            </div>
          </div>
        </div>
      </div>

      <div className='absolute w-full'>
        <Header />
      </div>
    </>
  )
}

export default NotFoundPage
