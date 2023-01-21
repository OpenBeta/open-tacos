import { useState, ChangeEventHandler, ChangeEvent, useEffect } from 'react'
import { NextPage, GetStaticProps } from 'next'
import Link from 'next/link'
import Fuse from 'fuse.js'
import clx from 'classnames'
import { useRouter } from 'next/router'

import { CountrySummaryType } from '../../js/types'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import { getAllCountries } from '../../js/graphql/api'

interface AreaPageProps {
  countries: CountrySummaryType[]
}

const Page: NextPage<AreaPageProps> = (props) => {
  const router = useRouter()
  return (
    <>
      <SeoTags title='All countries' />
      <Layout
        showFooter
        showFilterBar={false}
        contentContainerClass='content-default'
      >
        {router.isFallback ? <div>Loading...</div> : <Body {...props} />}
      </Layout>
    </>
  )
}

export default Page

const Body = ({ countries }: AreaPageProps): JSX.Element => {
  const [filtered, setFilter] = useState<FuseReturnType>([])
  return (
    <section className='max-w-lg mx-auto w-full p-4'>
      <h2>All Countries</h2>
      <div className='mt-8 mb-4 w-full flex lg:justify-end'>
        <FilterBox countries={countries} onChange={setFilter} />
      </div>
      <div className='py-8 flex gap-4 flex-wrap'>{filtered.map(Country)}</div>
    </section>
  )
}

interface CountryProps {
  item: CountrySummaryType
}

const Country = ({ item }: CountryProps): JSX.Element => {
  const { areaName, uuid, totalClimbs } = item
  return (
    <Link key={uuid} href={`/crag/${uuid}`}>
      <a>
        <button
          className={clx(
            'btn  btn-sm gap-4',
            totalClimbs > 0 ? '' : 'btn-outline'
          )}
        >
          {areaName}
          <div
            className={clx(
              'badge',
              totalClimbs > 0 ? 'badge-info' : 'badge-ghost'
            )}
          >
            {totalClimbs}
          </div>
        </button>
      </a>
    </Link>
  )
}

type FuseReturnType = CountryProps[]
interface FilterBoxProps {
  countries: CountrySummaryType[]
  onChange: (filteredList: FuseReturnType) => void
}

/**
 * A simple list filter
 */
const FilterBox = ({ countries, onChange }: FilterBoxProps): JSX.Element => {
  const [value, setValue] = useState('')
  const options = {
    includeScore: false,
    threshold: 0.3,
    keys: ['areaName']
  }
  const fuse = new Fuse(countries, options)

  useEffect(() => {
    onChange(reshape()) // show the entire list on initial rendering
  }, [])

  // transform country list to match the shape of fuse.search()
  const reshape = (): FuseReturnType => countries.map((entry) => ({ item: entry }))

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.currentTarget.value
    setValue(newValue)

    if (newValue == null || newValue?.length === 0) {
      onChange(reshape()) // no filter --> show the whole list
      return
    }

    onChange(fuse.search(newValue))
  }

  return (
    <div className='form-control'>
      <label className='input-group'>
        <span className='text-sm'>Filter</span>
        <input
          type='text'
          placeholder='Type a country name'
          className='focus:outline-0 input input-sm input-bordered'
          onChange={onChangeHandler}
          value={value}
        />
      </label>
    </div>
  )
}

// This function gets called at build time.
// Nextjs uses the result to decide which paths will get pre-rendered at build time
export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}

// This also gets called at build time
// Query graphql api for area by id
export const getStaticProps: GetStaticProps<AreaPageProps, { slug: string[] }> = async ({ params }) => {
  // const areaId = params?.slug?.[0] ?? null

  try {
    const countries = await getAllCountries()

    return {
      props: {
        countries
      },
      revalidate: 60
    }
  } catch (e) {
    return {
      notFound: true,
      revalidate: 10
    }
  }
}
