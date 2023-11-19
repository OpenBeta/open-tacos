import { PageContainer } from './general/page'

export default function Loading (): JSX.Element {
  return (
    <PageContainer>
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
    </PageContainer>
  )
}
