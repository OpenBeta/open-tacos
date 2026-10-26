import React from 'react'
import Spinner from '@/components/ui/Spinner'

/**
 * Loading screen for the full screen /maps route.
 */
export default function MapsLoading (): JSX.Element {
  return (
    <div className='relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-base-100 overflow-hidden'>
      <div className='absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]' />

      <div className='relative z-10 flex flex-col items-center gap-4 p-8 rounded-2xl bg-base-100/80 backdrop-blur-sm border border-base-content/10 shadow-lg text-center max-w-sm'>
        <div className='relative flex items-center justify-center'>
          <Spinner />
        </div>
        <div>
          <h2 className='text-lg font-bold text-base-content'>Loading Map</h2>
          <p className='text-xs text-base-content/70 mt-1'>
            Fetching climbing areas and crag coordinates...
          </p>
        </div>
      </div>
    </div>
  )
}
