import React from 'react'
import Header from '../components/Header'
// import guyOnBoulder from '../images/guy_on_boulder.png'
// import guyOnBoulderBG from '../images/guy_on_boulder_bg.png'
// import ImagePlane from '../components/ui/ImagePlane'

// <ImagePlane foregroundImage={guyOnBoulder} backgroundImage={guyOnBoulderBG}>
//         <div className='text-center mt-8'>
//           <div className='flex justify-center'>
//             <div className='bg-yellow-100 italic mb-2'>
//               404
//             </div>
//           </div>
//
//           <div className='bg-white text-6xl tracking-wide font-bold px-2 py-1'>
//             Page not found
//           </div>
//
//           <div className='mt-2 bg-white'>
//             You'll have to look somewhere else, it's not here
//           </div>
//         </div>
//       </ImagePlane>

function NotFoundPage (): JSX.Element {
  return (
    <div className='h-screen bg-gray-50 overflow-hidden'>
      <div className='bg-white'>
        <Header />
      </div>
    </div>
  )
}

export default NotFoundPage
