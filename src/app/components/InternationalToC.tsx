import Link from 'next/link'
import { SectionContainer } from './ui/SectionContainer'
import { INTERNATIONAL_DATA, ToCCountry } from './international-data'
import { ToCAreaEntry } from './USAToC'

/**
 * International table of content
 */
export const InternationalToC: React.FC = () => {
  return (
    <SectionContainer header={<h2>International</h2>}>
      <div className='columns-3xs gap-x-10'>
        {
          INTERNATIONAL_DATA.map(country =>
            <CountryCard key={country.uuid} country={country} />
          )
        }
      </div>
    </SectionContainer>
  )
}

const CountryCard: React.FC<{ country: ToCCountry }> = ({ country }) => {
  const { areaName, uuid, children } = country
  return (
    <div className='mb-10 break-inside-avoid-column break-inside-avoid'>
      <Link href={`/crag/${uuid}`}>
        <span className=' font-semibold'>{areaName}</span>
      </Link>
      <hr className='mb-2 border-1 border-base-content/60' />
      <div className='flex flex-col'>
        {
          children.map(area => <ToCAreaEntry key={area.uuid} {...area} />)
        }
      </div>
    </div>
  )
}
