import { ArrowRightIcon } from '@heroicons/react/20/solid'
import LinkedIn from '../assets/icons/li.inline.svg'
import Instagram from '../assets/icons/ig.inline.svg'
import Github from '../assets/icons/github.inline.svg'
import Twitter from '../assets/icons/twitter.inline.svg'

function Footer (): JSX.Element {
  return (
    <footer className='bg-contrast text-primary text-sm pb-8 lg:pb-24'>
      <nav className='max-w-7xl p-4 text-sm mx-auto'>
        <div className='mt-4 flex flex-col sm:flex-row gap-y-6 md:gap-y-0 items-center md:items-end justify-center md:justify-between'>
          <div className='align-center'>
            Help: {' '}
            <a
              className='font-semibold no-underline hover:underline'
              href='mailto:support@openbeta.io'
              target='_blank'
              rel='noopener noreferrer'
            >
              support@openbeta.io
            </a>
          </div>

          <a
            className='btn btn-secondary btn-sm gap-2' href='https://opencollective.com/openbeta/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Make a donation <ArrowRightIcon className='w-4 h-4' />
          </a>
        </div>
        <hr className='my-6 md:my-4 border-black' />
        <div className='flex flex-col md:flex-row gap-y-4 md:gap-y-0 items-center justify-between'>
          <div className='flex flex-col items-center md:items-start gap-y-2'>
            <a
              className='no-underline hover:underline'
              href='https://docs.openbeta.io'
            >
              Documentation
            </a>
            <a
              className='no-underline hover:underline'
              href='https://collective.openbeta.io/'
            >
              OpenBeta Collective
            </a>
            <a
              className='no-underline hover:underline'
              href='http://openbeta.io/blog/openbeta-vs-mountain-project-vs-thecrag'
              rel='noopener noreferrer'
            >
              OpenBeta vs others
            </a>
            <a
              className='no-underline hover:underline'
              href='https://openbeta.io/blog'
              rel='noopener noreferrer'
            >
              Blog
            </a>
          </div>
          <div className='flex flex-row items-center gap-x-4'>
            <a href='https://github.com/OpenBeta'>
              <Github className='w-8 h-8' />
            </a>
            <a href='https://www.instagram.com/openbetaproject/'>
              <Instagram className='w-8 h-8' />
            </a>
            <a href='https://twitter.com/OpenBetaHQ'>
              <Twitter className='w-8 h-8' />
            </a>
            <a href='https://www.linkedin.com/company/openbetacollective/'>
              <LinkedIn className='w-8 h-8' />
            </a>
          </div>
        </div>
      </nav>
    </footer>
  )
}
// <a className='inline-block' href='https://github.com/OpenBeta'><
export default Footer
