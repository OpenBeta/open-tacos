function Footer() {
    return (
      <footer className='bg-contrast text-primary'>
        <nav className='flex justify-between max-w-4xl p-4 mx-auto text-sm md:p-8'>
          <p className=''>
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

          <p>
            <a
            className='font-semibold no-underline'
            href='https://github.com/OpenBeta/open-tacos'
            target='_blank'
            rel='noopener noreferrer'
            >
              GitHub
            </a>
          </p>
        </nav>
      </footer>
    )
}

export default Footer;