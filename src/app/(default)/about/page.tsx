import React, { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from '@phosphor-icons/react/dist/ssr'

import mapHero from '@/public/hero-map.jpg'
import bouldering from '@/public/ray-phung-bouldering.jpg'
import CodingSvg from '@/assets/illustrations/coding-5-7'
import LightBulbSvg from '@/assets/illustrations/brainstorming-31'
import EcologySvg from '@/assets/illustrations/ecology-46'
import DiversitySvg from '@/assets/illustrations/diversity-1-69'

export default function AboutPage (): ReactNode {
  return (
    <article>
      <section className='bg-accent/80'>
        <div className='default-page-margins'>
          <div className='p-8 2xl:p-0 2xl:pb-8 2xl:pl-16'>
            <Hero />
            <Values />
          </div>
        </div>
      </section>
      <section className='border border-neutral  bg-base-100'>
        <div className='default-page-margins'>
          <div className='max-w-full mx-auto block lg:grid lg:grid-cols-2'>
            <div className='lg:border-r p-12 border-neutral'>
              <DetailCard
                icon={
                  <div className='bg-blue-500'>
                    <LightBulbSvg className='w-40 block mx-auto stroke-slate-800' />
                  </div>
                }
                title='Climbing data is the building block of knowledge'
                description='We stand on the shoulders of those who came before us. We want to ensure the knowledge of these great experiences remains irrevocably accessible to everyone. All climbing content (excluding photos) is available under the Creative Commons Public Domain license.'
              />
            </div>
            <div className='p-12'>
              <DetailCard
                icon={
                  <div className='bg-green-600'>
                    <EcologySvg className='mx-auto block w-40 stroke-slate-800' />
                  </div>
                }
                title='Make an impact today'
                description={<>All contributions are welcome. You can share climbing photos, add new routes, write a guest article on our blog, help fix a bug, and more. Check out the <a href='https://github.com/orgs/OpenBeta/projects/8' target='_blank' rel='noreferrer' className='underline'>project board on GitHub</a>.</>}
              />
            </div>
          </div>

        </div>

      </section>
      <section className='border-l border-r border-b border-neutral  bg-base-100'>
        <div className='default-page-margins'>
          <div className='max-w-full mx-auto block lg:grid lg:grid-cols-2'>
            <div className='md:border-r p-12 border-neutral'>
              <DetailCard
                icon={
                  <div className='bg-accent/90'>
                    <DiversitySvg className='mx-auto block w-48 stroke-slate-800' />
                  </div>
                }
                title='Donate'
                description={<>OpenBeta is neither backed by venture capitalists nor supported by ads. Fortunately, an active group of volunteers donates their time and expertise to keep the project running and to further its development.  <i>All donated money goes directly to fund OpenBeta's infrastructure.</i><br /> <a href='https://opencollective.com/openbeta' className='mt-4 btn btn-sm btn-primary'>Donate now</a></>}
              />
            </div>
            <div className='relative bg-black'>
              <div className='relative block'>
                <Image
                  src={bouldering}
                  alt='Picture of a rock climber bouldering in Bishop, California.'
                  width={700}
                  unoptimized
                />
                <div className='absolute left-0 bottom-0 bg-base-200/80 p-2 text-xs'>
                  <Link href='/climbs/197b6958-c871-5c81-b463-d493d7515656' className='block'>Flyboy (Bishop, California)</Link>
                  <a href='https://www.instagram.com/rayphungphoto/' target='_blank' rel='noreferrer' className='font-semibold'>&copy; Ray Phung</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </article>
  )
}

const Hero: React.FC = () => (
  <div className='lg:grid lg:grid-cols-2 gap-8 items-center'>
    <div>
      <h1 className='text-5xl tracking-tighter font-semibold mb-6'>An Open Source Resource<br /> For Climbers</h1>
      <p>Inspired by Wikipedia and OpenStreetMap, we're building an open source & open license rock climbing catalog.</p>
    </div>
    <div className='relative block'>
      <div className='py-16'>
        <Image
          className='block rounded-box border-4 border-slate-600 shadow-xl'
          src={mapHero}
          alt='Picture of a map'
          width={350}
          unoptimized
        />
      </div>
      <div className='absolute bottom-0 left-24'>
        <CodingSvg className='block w-56 stroke-slate-800' />
      </div>
    </div>
  </div>
)

const Values: React.FC = () => (
  <div className=''>
    <h3 className='text-2xl text-secondary pb-6'>Our values</h3>

    <div className='flex flex-col gap-6'>
      <ValuePropCard
        title='Free & Open Source'
        description='$0 to use and 100% open source.'
      />

      <ValuePropCard
        title='Respect user privacy'
        description='No Ads, No tracking.'
      />

      <ValuePropCard
        title='Community First'
        description='Backed by a volunteer-run nonprofit organization.'
      />
    </div>
  </div>
)

const ValuePropCard: React.FC<{ title: string, description: string }> = ({ title, description }) => (
  <div className='flex gap-2'>
    <CheckCircle size={28} weight='bold' />
    <div>
      <span className='font-semibold text-xl'>{title}</span>
      <p className='text-secondary'>{description}</p>
    </div>
  </div>
)

const DetailCard: React.FC<{ title: string, description: string | ReactNode, icon: ReactNode }> = ({ title, description, icon }) => (
  <>
    {icon}
    <h3 className='text-2xl font-semibold tracking-tighter text-primary/80 pt-6 pb-2'>{title}</h3>
    <p>{description}</p>
  </>
)
