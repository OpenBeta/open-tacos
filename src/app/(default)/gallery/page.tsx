import { Suspense } from 'react'
import Gallery from '../components/media/Gallery'

export default function Page (): JSX.Element {
  return (
    <Suspense>
      <Gallery />
    </Suspense>
  )
}
