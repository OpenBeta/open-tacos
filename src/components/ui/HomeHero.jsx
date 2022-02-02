
const HomeHero = ({ children }) => {
  return (
    <div className='home-hero'>
      <div className='absolute flex items-center justify-end top-0 left-0 w-full h-full gap-x-4' style={{ background: 'rgba(0,0,0,0.35)' }}>
        {children}
      </div>
    </div>
  )
}

export default HomeHero
