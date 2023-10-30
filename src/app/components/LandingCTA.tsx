import clx from 'classnames'

import { LoginButtonClient } from './LoginButton'
import { ShowEmailJS } from './ShowEmailJS'
import { ReactNode } from 'react'

export const LandingCTA: React.FC = () => {
  return (
    <div className='w-full p-4 md:p-10'>
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
      body={
        <ul>
          <li>☑️ Fix a bug.</li>
          <li>☑️ Use OpenBeta API & data in your projects.</li>
        </ul>
      }
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
      body={
        <ul>
          <li>☑️ Add missing climbs.</li>
          <li>☑️ Help us make your local climbing area&#39;s pages even better!</li>
        </ul>
      }
      action={<LoginButtonClient className='btn btn-outline bg-accent btn-sm px-4 border-b-neutral border-b-2' label='Login' />}
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

export const DonateButton: React.FC = () => (<a className='btn btn-outline btn-sm bg-emerald-500 border-b-2 px-4' href='https://opencollective.com/openbeta'>Donate</a>)

const Donate: React.FC = () => {
  return (
    <Card
      title='Become a financial supporter'
      body='OpenBeta is a nonprofit funded by users like you!  If you support our mission to keep climbing knowledge free and open, please consider making a donation today.'
      action={<DonateButton />}
    />
  )
}

interface CTACardProps {
  title: string
  body: string | ReactNode
  action: React.ReactNode
  className?: string
}

const Card: React.FC<CTACardProps> = ({ title, body, action, className }) => {
  return (
    <div className='px-4'>
      <h2 className='px-4 font-medium text-base-200 uppercase'>{title}</h2>
      <div className={clx('bg-base-200/20 px-4 card max-w-sm bg-base-100 shadow-lg', className)}>
        <div className='card-body'>
          <div>{body}</div>
          <div className='card-actions justify-end items-center gap-x-4 py-2'>
            {action}
          </div>
        </div>
      </div>
    </div>
  )
}
