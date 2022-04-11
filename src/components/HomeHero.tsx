import StatsPanel, { StatsPanelProps } from './ui/StatsPanel'
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
    </>
  )
}
const LargeScreen = ({ statsProps }: ResponsiveScreenProps): JSX.Element => {
  return (
    <div className='hidden lg:home-hero'>
      <div className='absolute flex items-center justify-end top-0 left-0 w-full h-full gap-x-4' style={{ background: 'rgba(0,0,0,0.35)' }}>
        <section className='flex flex-col items-center pr-16'>
          <h1 className='text-white'>Rock Climbing Wiki</h1>
          <StatsPanel isMobile={false} className='px-32 py-4' {...statsProps} />
        </section>
      </div>
    </div>
  )
}

export default HomeHero
