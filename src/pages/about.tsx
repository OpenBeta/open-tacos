import Layout from '../components/layout'
import LandingHero from '../components/ui/LandingHero'
import Image from 'next/image'
import Cairn from '../assets/icons/stones.png'
import Seed from '../assets/icons/seed.png'
import Watering from '../assets/icons/watering-can.png'

export const meta = {
  title: 'About the project',
  keywords: ['OpenBeta', 'rock climbing']
}

const About = (props): JSX.Element => {
  return (
    <Layout hero={<LandingHero />}>
      <div className='text-center'>
        <h1>An open source resource for rock climbers</h1>
        <h3 className='text-3xl my-12'>OpenTacos is a wiki for climbers to research and contribute information about rock climbing routes.</h3>
      </div>
      <div className='py-8'>
        <Image className='opacity-80' src={Cairn} width={48} height={48} alt='cairn' />
        <h2 className='mb-2'>Climbing data is the building block of knowledge</h2>
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
          You can become a monthly backer for as little as $3/month.  <strong><a className='underline' href='https://opencollective.com/openbeta'>Donate today</a>!</strong>
        </p>
        <p className='italic text-xl text-slate-700'>OpenBeta is a 501(c)(3) nonprofit collective.  Donations are tax-deductible.</p>
      </div>
    </Layout>
  )
}

export default About

// We want contributing to the project be fun and educational.  All contributions are welcome, including new routes, blog posts, bug fixes, and more.

// ## Not sure how to start contributing?

// No worries, you can ask questions on the community [message board](https://community.openbeta.io) or on [OpenBeta Discord](https://discord.gg/w2KpQu2ca5) chat server.

// ## To see what we're working on

// Check out the [GitHub issue](https://github.com/openbeta/open-tacos/issues)

// ## How to submit an edit

// We host this project on GitHub.com, a popular source code hosting platform.
// Information for each climbing route and area is stored in a human-readable text file.
// We purposely avoid complex database techonology, instead rely on many existing features of GitHub to help us keep track of user edits.  Climbers can join an area admin group to help us review and approve changes.

// A sample route description file:

// ```
// ---
// route_name: Chain Reaction
// type:
//   sport: true
// yds: 5.12c
// fa: Alan Watts
// ---

// # Description
// One of the most photogenic routes at Smith Rock.

// # Protection
// Quickdraws
// ```

// This file format is commonly known as [Markdown](https://www.markdownguide.org/).
// Metadata for the climb or the area is placed in the *front matter* section sandwiched between two --- lines.

// > Note: For now, you need to create an account on GitHub.com to add new routes/areas or edit existing ones.  We are working on simplifying the process in the near future.

// ## How to contribute code

// We're looking for help with User experience design, web development (CSS/React/Node.js), and data science (Python/Pandas).

// OpenBeta is a volunteer effort. We encourage you to pitch in and join the team!

// Thanks! ❤️ ❤️ ❤️

// OpenBeta Team
