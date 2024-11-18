import { AppAlert } from '@/components/broadcast/AppAlert'
import { SignupButton } from './DesktopHeader'

export const LandingHero: React.FC = () => {
  return (
    <section className='mt-4'>
      <AppAlert
        message={
          <>
            <h1 className='text-xl tracking-tighter font-bold'>Share your climbing route knowledge!</h1>
            <div className='font-medium text-neutral/80'>
              <p>Join us to help improve this comprehensive <br /> climbing resource for the community.</p>
            </div>
            <SignupButton />
          </>
        }
      />
    </section>
  )
}
