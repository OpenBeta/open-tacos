import { PageContainer } from './general/page'

/**
 * Loading skeleton
 */
export default function Loading (): JSX.Element {
  return (
    <PageContainer id='loading'>
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
    </PageContainer>
  )
}
