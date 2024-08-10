import { Logo, LogoSize } from '../header'
/**
 * Page footer
 */
export const PageFooter: React.FC = () => {
  return (
    <footer className='relative footer p-10 bg-base-content text-base-100'>
      <aside>
        <div className='border-2 border-accent py-3 pl-2 pr-4 rounded-full'><Logo size={LogoSize.md} className='fill-accent' /></div>
        <p><span className='font-semibold text-lg'>OpenBeta</span><br /><span className='tracking-tight font-sm'>Free climbing database built & run by climbers.</span></p>
      </aside>
      <nav>
        <header className='footer-title'>Get involved</header>
        <a className='link link-hover' href='https://collective.openbeta.io/get-involved'>How to get involved</a>
        <a className='link link-hover' href='https://docs.openbeta.io/how-to-contribute/overview'>Dev onboarding</a>
      </nav>
      <nav>
        <header className='footer-title'>Social</header>
        <a className='link link-hover' href='https://community.openbeta.io/'>Forums</a>
        <a className='link link-hover' href={process.env.NEXT_PUBLIC_DISCORD_INVITE}>Discord chat</a>
        <a className='link link-hover' href='https://www.instagram.com/openbetaproject/'>Instagram</a>
        <a className='link link-hover' href='https://www.linkedin.com/company/openbetahq/'>LinkedIn</a>
        <a className='link link-hover' href='https://twitter.com/openbetahq'>Twitter</a>
      </nav>
      <nav>
        <header className='footer-title'>The Org</header>
        <a className='link link-hover' href='https://collective.openbeta.io/about'>About us</a>
        <a className='link link-hover' href='http://openbeta.io/blog/openbeta-vs-mountain-project-vs-thecrag'>OpenBeta vs others</a>
        <a className='link link-hover' href='https://openbeta.substack.com/'>Our blog</a>
        <a className='link link-hover' href='https://opencollective.com/openbeta'>Make a donation</a>
        <a className='link link-hover' href='https://opencollective.com/openbeta/contribute/t-shirt-31745'>Buy a T-shirt</a>
        <a className='link link-hover' href='/partner-with-us/'>Become a Partner</a>
      </nav>
      <nav>
        <header className='footer-title'>Source code</header>
        <a className='link link-hover' href='https://github.com/OpenBeta/'>OpenBeta on GitHub</a>
        <a className='link link-hover' href='https://github.com/OpenBeta/open-tacos'>Climb catalog (this site!)</a>
        <a className='link link-hover' href='https://github.com/OpenBeta/openbeta-graphql'>GraphQL API</a>
        <a className='link link-hover' href='https://github.com/OpenBeta/sandbag'>Sandbag library</a>
        <a className='link link-hover' href='https://github.com/OpenBeta/docs.openbeta.io'>Docs site</a>
      </nav>
    </footer>
  )
}
