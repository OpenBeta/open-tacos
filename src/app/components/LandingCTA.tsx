import clx from 'classnames'

import { LoginButtonClient } from './LoginButton'
import { ShowEmailJS } from './ShowEmailJS'

export const LandingCTA: React.FC = () => {
  return (
    <div className='w-full'>
      <div className='flex flex-rows flex-wrap gap-6 justify-center'>
        <Card4All />
        <Card4Coders />
        <Leaders />
        <Donate />
      </div>
    </div>
  )
}

const Card4Coders: React.FC = () => {
  return (
    <Card
      title='Coders'
      body='Fix a bug. Use OpenBeta API & data in your projects.'
      action={
        <>
          <a href='https://docs.openbeta.io/how-to-contribute/overview' className='text-sm underline'>Dev onboarding</a>
          <a className='btn btn-primary btn-sm btn-outline' href='https://github.com/orgs/OpenBeta/'>GitHub</a>
        </>
      }
    />
  )
}

const Card4All: React.FC = () => {
  return (
    <Card
      title='Climbers'
      body='Add missing climbs.  Help us make your local climbing&lsquo;s area page even better!'
      action={<LoginButtonClient className='btn btn-primary btn-sm px-4 btn-outline' label='Login' />}
    />
  )
}

const Leaders: React.FC = () => {
  return (
    <Card
      title='Community Leaders'
      body='Serve as a core volunteer for 3-6 months. Apply your industry expertise to help shape the future of climbing in the digital age.'
      action={<ShowEmailJS />}
    />
  )
}

const Donate: React.FC = () => {
  return (
    <Card
      title='Become a financial supporter'
      body='OpenBeta is nonprofit and funded by users like you!  If you support our mission to keep climbing knowledge free and open, please consider making a donation today.'
      action={<a className='btn btn-outline btn-sm bg-emerald-500 border-b-2 px-4' href='https://opencollective.com/openbeta'>Donate</a>}
    />
  )
}

interface CTACardProps {
  title: string
  body: string
  action: React.ReactNode
  className?: string
}

const Card: React.FC<CTACardProps> = ({ title, body, action, className }) => {
  return (
    <div className='px-4'>
      <h2 className='font-medium text-base-content/60 uppercase'>{title}</h2>
      <div className={clx('px-4 card card-bordered max-w-sm bg-base-100 shadow-lg', className)}>
        <div className='card-body'>
          <p>{body}</p>
          <div className='card-actions justify-end items-center gap-x-4 py-2'>
            {action}
          </div>
        </div>
      </div>
    </div>
  )
}
