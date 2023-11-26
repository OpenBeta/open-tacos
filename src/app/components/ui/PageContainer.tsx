import React from 'react'

export const PageContainer: React.FC<{ map: React.ReactNode, children: React.ReactNode }> = ({ map, children }) => {
  return (
    <article>
      <div className='p-4 mx-auto max-w-5xl xl:max-w-7xl'>
        {children}
      </div>
      <div id='#map' className='w-full mt-16 relative h-[90vh] border-t'>
        {map}
      </div>
    </article>
  )
}
