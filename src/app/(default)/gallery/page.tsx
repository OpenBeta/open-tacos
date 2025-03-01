import { Suspense } from 'react'

export default function Page (): any {
  return <Suspense><Gallery /></Suspense>
}

function Gallery (): any {
  return (
    <div className='h-screen w-screen'>
      <div className='m-6 text-sm'>Please wait...</div>
    </div>
  )
}
