import { SectionContainer } from './components/EditAreaContainers'

/**
 * Loading skeleton
 */
export default function Loading (): JSX.Element {
  return (
    <SectionContainer id='loading'>
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
      <div className='card card-compact card-bordered w-full h-56 bg-base-300/20' />
    </SectionContainer>
  )
}
