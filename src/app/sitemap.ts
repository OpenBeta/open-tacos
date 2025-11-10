import { MetadataRoute } from 'next'
import { graphqlClient } from '@/js/graphql/Client'
import { gql } from '@apollo/client'
import { IndexResponseType } from '@/js/types'

const query = gql`query UsaAreas( $filter: Filter) {
    areas(filter: $filter, sort: { totalClimbs: -1 }) {
      id
      uuid
      areaName
      pathTokens
      totalClimbs
      density
    }
  }`

export default async function sitemap (): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://openbeta.io'
    : 'http://localhost:3000'

  const staticPages: string[] = [
    '/about',
    '/blog',
    '/blog/openbeta-vs-mountain-project-vs-thecrag'
  ]

  // Classic climbs pulled from https://www.climbing.com/places/the-50-classic-climbs-of-north-america/
  const classicClimbUuids: string[] = [
    '1609469e-2b62-558a-acef-f267536f1f3f',
    'b31ffdb5-2089-588c-996c-b1a5568670ea',
    'ca9b70a2-8745-505c-9b3a-8964226b564d',
    'a3624f5e-e607-5a3e-9f3e-a8d4ccc68dc0',
    'c0eeb0d1-04af-5cde-9064-ecbbea3f9c6b',
    '5665633f-fd6f-5f7f-a7c8-2d8cb8980221',
    'ac737862-3b77-5e46-8e9f-d91c04dcd8ad',
    'c693d5e5-d44b-5c9f-82e8-6535f243b5ad',
    '288b96ec-74c0-5216-a23a-25b6857e56e6',
    'e30e3f6a-1be8-52b7-91da-7c1a1a2ff981',
    'b36d4e3e-9ccf-5a04-98e1-2ea6788e350c',
    '4b4e454d-e24f-52f9-849b-ba50dcdb5f01',
    '0022799a-aa05-55d1-b1a7-5d46c2583dbe',
    'dbac7e4c-f4cf-5311-ba82-40c2e21cc932',
    '3ba65df3-7be4-567a-8ff4-7b16561fb2bb',
    '26dbd70a-68ed-57ae-a074-b212434f4cc5',
    '08eddae2-2efa-5f45-b15b-ec9ca8e6d46a',
    'e031119e-8fa8-5b82-9b82-7796ee6724b9',
    '07bb5409-5e78-53ed-bb62-3438c796d1b3',
    '56a5b36e-64bb-59fe-b90d-6d8a39c302cc',
    'd587b3c9-86c0-58fa-a87b-6cdf7ef83a79'
  ]

  const { data } = await graphqlClient.query<IndexResponseType>({
    query,
    variables: {
      filter: {
        field_compare: [{
          field: 'totalClimbs',
          num: 400,
          comparison: 'gt'
        }, {
          field: 'density',
          num: 0.5,
          comparison: 'gt'
        }]
      }
    }
  })

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((url) => ({
    url: `${baseUrl}${url}`,
    changeFrequency: 'monthly',
    priority: 1.0
  }))

  const areaEntries: MetadataRoute.Sitemap = (data?.areas ?? []).map(({ uuid }) => ({
    url: `${baseUrl}/area/${uuid}`,
    changeFrequency: 'monthly',
    priority: 1.0
  }))

  const climbEntries: MetadataRoute.Sitemap = classicClimbUuids.map((uuid) => ({
    url: `${baseUrl}/climb/${uuid}`
  }))

  return [...staticEntries, ...areaEntries, ...climbEntries]
}
