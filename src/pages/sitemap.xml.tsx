import { graphqlClient } from '../js/graphql/Client'
import { gql } from '@apollo/client'
import { IndexResponseType } from '../js/types'

const Sitemap = (): void => { }

const query = gql`query UsaAreas( $filter: Filter) {
    areas(filter: $filter, sort: { totalClimbs: -1 }) {
      id
      uuid
      areaName
      pathTokens
      totalClimbs
      density
      aggregate {
        byDiscipline {
            sport {
              total
            }
            trad {
              total
            }
            boulder {
              total
            }
            tr {
              total
            }
            alpine {
              total
            }
            mixed {
              total
            }
            aid {
              total
            }
          }
      }
      metadata {
        lat
        lng
        areaId
      }
      media {
        mediaUrl
        mediaUuid
      }
    }
  }`

export const getServerSideProps = async ({ res }): Promise<object> => {
  const baseUrl: string = {
    development: 'http://localhost:3000',
    production: 'https://tacos.openbeta.io'
  }[process.env.NODE_ENV]

  const staticPages: string[] = ['https://tacos.openbeta.io/about']

  //  classic climbs pulled from https://www.climbing.com/places/the-50-classic-climbs-of-north-america/
  const classicClimbs: string[] = [
    'https://tacos.openbeta.io/climbs/1609469e-2b62-558a-acef-f267536f1f3f',
    'https://tacos.openbeta.io/climbs/b31ffdb5-2089-588c-996c-b1a5568670ea',
    'https://tacos.openbeta.io/climbs/ca9b70a2-8745-505c-9b3a-8964226b564d',
    'https://tacos.openbeta.io/climbs/a3624f5e-e607-5a3e-9f3e-a8d4ccc68dc0',
    'https://tacos.openbeta.io/climbs/c0eeb0d1-04af-5cde-9064-ecbbea3f9c6b',
    'https://tacos.openbeta.io/climbs/5665633f-fd6f-5f7f-a7c8-2d8cb8980221',
    'https://tacos.openbeta.io/climbs/ac737862-3b77-5e46-8e9f-d91c04dcd8ad',
    'https://tacos.openbeta.io/climbs/c693d5e5-d44b-5c9f-82e8-6535f243b5ad',
    'https://tacos.openbeta.io/climbs/288b96ec-74c0-5216-a23a-25b6857e56e6',
    'https://tacos.openbeta.io/climbs/e30e3f6a-1be8-52b7-91da-7c1a1a2ff981',
    'https://tacos.openbeta.io/climbs/b36d4e3e-9ccf-5a04-98e1-2ea6788e350c',
    'https://tacos.openbeta.io/climbs/4b4e454d-e24f-52f9-849b-ba50dcdb5f01',
    'https://tacos.openbeta.io/climbs/0022799a-aa05-55d1-b1a7-5d46c2583dbe',
    'https://tacos.openbeta.io/climbs/dbac7e4c-f4cf-5311-ba82-40c2e21cc932',
    'https://tacos.openbeta.io/climbs/3ba65df3-7be4-567a-8ff4-7b16561fb2bb',
    'https://tacos.openbeta.io/climbs/26dbd70a-68ed-57ae-a074-b212434f4cc5',
    'https://tacos.openbeta.io/climbs/08eddae2-2efa-5f45-b15b-ec9ca8e6d46a',
    'https://tacos.openbeta.io/climbs/e031119e-8fa8-5b82-9b82-7796ee6724b9',
    'https://tacos.openbeta.io/climbs/07bb5409-5e78-53ed-bb62-3438c796d1b3',
    'https://tacos.openbeta.io/climbs/56a5b36e-64bb-59fe-b90d-6d8a39c302cc',
    'https://tacos.openbeta.io/climbs/d587b3c9-86c0-58fa-a87b-6cdf7ef83a79'
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

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map((url) => {
          return `
            <url>
              <loc>${url}</loc>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `
        })
        .join('')}
        ${data?.areas
            .map(({ uuid }) => {
                return `
                  <url>
                    <loc>${baseUrl}/areas/${uuid}</loc>
                    <changefreq>monthly</changefreq>
                    <priority>1.0</priority>
                  </url>
                `
            })
    .join('')}
    ${classicClimbs
      .map((url) => {
        return `
          <url>
            <loc>${url}</loc>
          </url>
        `
      })
      .join('')}
      </urlset>
    `

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default Sitemap
