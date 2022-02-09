import StatsPanel, { StatsPanelProps } from './ui/StatsPanel'
import AlgoliaSearchWidget from './search/AlgoliaSearchWidget'
interface HomeHeroProps {
  statsProps: StatsPanelProps
}

interface ResponsiveScreenProps {
  statsProps: StatsPanelProps
}

const HomeHero = ({ statsProps }: HomeHeroProps): JSX.Element => {
  return (
    <>
      <LargeScreen statsProps={statsProps} />
      <SmallScreen statsProps={statsProps} />
    </>
  )
}
const LargeScreen = ({ statsProps }: ResponsiveScreenProps): JSX.Element => {
  return (
    <div className='hidden lg:home-hero'>
      <div className='absolute flex items-center justify-end top-0 left-0 w-full h-full gap-x-4' style={{ background: 'rgba(0,0,0,0.35)' }}>
        <section className='flex flex-col items-center pr-8'>
          <h1 className='text-white'>Rock Climbing Wiki</h1>
          <StatsPanel isMobile={false} className='px-32 py-4' {...statsProps} />
        </section>
      </div>
    </div>
  )
}

const SmallScreen = ({ statsProps }: ResponsiveScreenProps): JSX.Element => {
  return (
    <div className='home-hero-mobile'>
      <section className='h-full flex flex-col justify-center items-center'>
        <h1 className='landscape:mt-16 text-white text-3xl text-center mb-8 semibold'>
          Rock Climbing Wiki
        </h1>
        <div className='mb-6 px-4 sm:px-8 md:max-w-screen-sm w-full'>
          <AlgoliaSearchWidget placeholder='Levitation 29' />
        </div>
        <StatsPanel isMobile className='portrait:mt-16 px-16 py-2' {...statsProps} />
      </section>
    </div>
  )
}

export default HomeHero
