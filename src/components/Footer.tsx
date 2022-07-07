import Image from 'next/image'
import LinkedIn from "../assets/icons/li.inline.svg";
import Instagram from "../assets/icons/ig.inline.svg";
import Github from "../assets/icons/github.inline.svg";
import Twitter from "../assets/icons/twitter.inline.svg";

function Footer() {
    return (
      <footer className='bg-contrast text-primary'>
        <nav className='xl:flex justify-between max-w-7xl p-4 mx-auto text-sm md:p-8'>
          <p className='md:text-center'>
            Support Email: {' '}
            <a
            className='font-semibold no-underline'
            href='mailto:support@openbeta.io'
            target='_blank'
            rel='noopener noreferrer'
            >
              support@openbeta.io
            </a>
          </p>

          <p className='md:text-center '>
            A project by {' '}
            <a
            className='font-semibold no-underline'
            href='https://openbeta.io'
            target='_blank'
            rel='noopener noreferrer'
            >
              OpenBeta
            </a>
          </p>

          <div className="flex justify-center ">
            <div className="flex flex-row items-center w-48 justify-between">
              <a href="https://github.com/OpenBeta"><Image src={Github} /></a>
              <a href="https://www.instagram.com/openbetaproject/"><Image src={Instagram} /></a>
              <a href="https://twitter.com/OpenBetaHQ"><Image src={Twitter} /></a>
              <a href="https://www.linkedin.com/company/openbetacollective/"><Image src={LinkedIn} /></a>
            </div>
          </div>
        </nav>
      </footer>
    )
}

export default Footer;