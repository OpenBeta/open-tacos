import Image from 'next/image'
import Layout from '../components/layout'
import AboutHero from '../components/ui/AboutHero'
import Cairn from '../assets/icons/stones.png'
import Seed from '../assets/icons/seed.png'
import Watering from '../assets/icons/watering-can.png'
import SeoTags from '../components/SeoTags'

const About = (): JSX.Element => {
  return (
    <Layout contentContainerClass='content-default' showFilterBar={false}>
      <SeoTags title='About' />
      <AboutHero />
      <div className='max-w-screen-md mx-auto py-8 px-4 md:px-8 md:py-12'>
        <div className='text-center'>
          <h1>An Open Source Resource For Rock Climbers</h1>
          <h3 className='text-3xl my-12'>Inspired by Wikipedia and OpenStreetMap, we're building the first open source &#38; open license rock climbing catalog.</h3>
        </div>
        <div className='text-center py-8'>
          <Image className='opacity-80' src={Cairn} width={48} height={48} alt='cairn' />
          <h2 className='mb-2'>Climbing data — the building block of knowledge</h2>
          <p className='text-xl text-slate-700'>
            In climbing we stand on the shoulders of those who came before us.  We want to ensure the knowledge of these great experiences remains irrevocably accessible to everyone.  Content (excluding photos) is available under the <a href='https://creativecommons.org/share-your-work/public-domain/cc0/' target='_blank' className='underline' rel='noreferrer'>Creative Commons Public Domain license</a>.
          </p>
        </div>
        <div className='text-center py-8'>
          <div className='-ml-2'><Image src={Seed} width={64} height={64} alt='seed' /></div>
          <h2 className='mb-2'>How can you get involved?</h2>
          <p className='text-xl text-slate-700'>
            All contributions are welcome.  You can share climbing photos, add new routes, write a guest article on our <a className='underline' href='https://openbeta.substack.com/' rel='noopener noreferrer'>blog</a>, help fix a bug, and more.  Check out the <a className='underline' href='https://github.com/OpenBeta/open-tacos/issues' rel='noopener noreferrer'>GitHub issues</a>.
          </p>
          <p className='text-xl text-slate-700'>Still not sure how to get started?  Chat with other volunteers on <a className='underline' href='https://discord.gg/ptpnWWNkJx' rel='noopener noreferrer'>Discord</a>.</p>
        </div>

      </div>
      <div className='text-center  px-4 py-8 bg-ob-secondary bg-opacity-80'>
        <div className='max-w-screen-md mx-auto '>
          <Image src={Watering} width={64} height={64} alt='watering can' />
          <h2 className='mb-2'>Why we need your donations</h2>
          <p className='text-xl text-black'>
            OpenBeta is not backed by venture capitalists, nor it is supported by ads.
            Fortunately there is a small and active group of volunteers donating their time and expertise to keep the project running and develop it further.
          </p>
          <p className='text-xl text-black'>
            For the project to survive and continue to evolve, we need your financial support and ask for your donation today.
            All money donated will go directly to fund OpenBeta infrastructure.
          </p>
          <p className='mt-8 text-xl text-black'>
            You can become a sustaining member for as little as $3/month.
          </p>
          <strong><a className='text-xl underline' href='https://opencollective.com/openbeta' rel='noopener noreferrer'>Donate today</a>!</strong>
          <p className='mt-8 italic text-xl text-slate-700 text-base'>OpenBeta is a 501(c)(3) nonprofit collective.  Donations are tax-deductible to the extent allowed by law.</p>
        </div>
      </div>
      <div className='text-center text-black py-24 bg-ob-primary px-4'>
        <h2 className='mb-2 text-black'>Learn more</h2>
        <p>Why is an <b>open license</b> important?</p>
        <a
          href='https://openbeta.substack.com/p/openbeta-vs-mountainproject-vs-thecrag'
          target='_blank' rel='noopener noreferrer'
          className='text-black underline'
        >OpenBeta vs MountainProject vs theCrag
        </a>
      </div>
    </Layout>
  )
}

export default About
