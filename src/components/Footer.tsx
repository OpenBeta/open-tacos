import Image from 'next/legacy/image'
import LinkedIn from '../assets/icons/li.inline.svg'
import Instagram from '../assets/icons/ig.inline.svg'
import Github from '../assets/icons/github.inline.svg'
import Twitter from '../assets/icons/twitter.inline.svg'
import { Button, ButtonVariant } from '../components/ui/BaseButton'

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

          <div>
            <Button
              href='https://opencollective.com/openbeta/'
              target='_blank'
              rel='noopener noreferrer'
              label='Make a donation'
              variant={ButtonVariant.SOLID_SECONDARY}
            />
          </div>
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
          </div>
          <div className='flex flex-row items-center gap-x-4'>
            <a href='https://github.com/OpenBeta'>
              <Image className='w-6 h-6' src={Github} />
            </a>
            <a href='https://www.instagram.com/openbetaproject/'>
              <Image className='w-6 h-6' src={Instagram} />
            </a>
            <a href='https://twitter.com/OpenBetaHQ'>
              <Image className='w-6 h-6' src={Twitter} />
            </a>
            <a href='https://www.linkedin.com/company/openbetacollective/'>
              <Image className='w-6 h-6' src={LinkedIn} />
            </a>
          </div>
        </div>
      </nav>
    </footer>
  )
}
// <a className='inline-block' href='https://github.com/OpenBeta'><
export default Footer
