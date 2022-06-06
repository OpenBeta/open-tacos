import Image from 'next/image'
import Layout from '../components/layout'
import AboutHero from '../components/ui/AboutHero'
import Cairn from '../assets/icons/stones.png'
import Seed from '../assets/icons/seed.png'
import Watering from '../assets/icons/watering-can.png'

export const meta = {
  title: 'About the project',
  keywords: ['OpenBeta', 'rock climbing']
}

const About = (): JSX.Element => {
  return (
    <Layout showFilterBar={false} hero={<AboutHero />}>
      <div className='text-center'>
        <h1>An open source resource for rock climbers</h1>
        <h3 className='text-3xl my-12'>OpenTacos is a wiki for climbers to research and contribute information about rock climbing routes.</h3>
      </div>
      <div className='py-8'>
        <Image className='opacity-80' src={Cairn} width={48} height={48} alt='cairn' />
        <h2 className='mb-2'>Climbing data — the building block of knowledge</h2>
        <p className='text-xl text-slate-700'>
          In climbing we stand on the shoulders of those whose came before us.  We want to ensure the knowledge of these great experiences remains irrevocably accessible to everyone.  Content (excluding photos) is available under Creative Commons Public Domain license.
        </p>
      </div>
      <div className='py-8'>
        <div className='-ml-2'><Image src={Seed} width={64} height={64} alt='seed' /></div>
        <h2 className='mb-2'>How can you get involved?</h2>
        <p className='text-xl text-slate-700'>
          All contributions are welcome, including new routes, blog posts, bug fixes, and more.  Check out the <a className='underline' href='https://github.com/OpenBeta/open-tacos/issues'>GitHub issues</a>.
        </p>
        <p className='text-xl text-slate-700'>Still not sure how to get started?  Chat with other volunteers on <a className='underline' href='https://discord.gg/w2KpQu2ca5'>Discord</a>.</p>
      </div>
      <div className='py-8'>
        <Image src={Watering} width={64} height={64} alt='watering can' />
        <h2 className='mb-2'>Why we need your donations</h2>
        <p className='text-xl text-slate-700'>
          OpenBeta is not backed by venture capitalists, nor it is supported by ads.
          Fortunately there is a small and active group of volunteers donating their time and expertise to keep the project running and develop it further.
        </p>
        <p className='text-xl text-slate-700'>
          For the project to survive and continue to evolve, we need your financial support and ask for your donation today.
          All money donated will go directly to fund OpenBeta infrastructure.
        </p>
        <p className='text-xl text-slate-700'>
          You can become a sustaining member for as little as $3/month.  <strong><a className='underline' href='https://opencollective.com/openbeta'>Donate today</a>!</strong>
        </p>
        <p className='italic text-xl text-slate-700'>OpenBeta is a 501(c)(3) nonprofit collective.  Donations are tax-deductible.</p>
      </div>
    </Layout>
  )
}

export default About
