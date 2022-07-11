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
<<<<<<< HEAD
<<<<<<< HEAD
    production: 'https://tacos.openbeta.io'
  }[process.env.NODE_ENV]

<<<<<<< HEAD
<<<<<<< HEAD
  const staticPages: string[] = ['https://tacos.openbeta.io/about']
=======
  const staticPages: Array<string> = ['https://tacos.openbeta.io/about']
>>>>>>> c5fb170 (Fixed url, added about page)
=======
  const staticPages: string[] = ['https://tacos.openbeta.io/about']
>>>>>>> e41d63e (Added about, fixed url)

=======
    production: 'https://tacos.openbeta.io/'
  }[process.env.NODE_ENV]

>>>>>>> 6f321e1 (added sitemap.xml)
=======
    production: 'https://tacos.openbeta.io/'
  }[process.env.NODE_ENV]

>>>>>>> a8f01d9 (added sitemap.xml)
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
<<<<<<< HEAD
<<<<<<< HEAD
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
<<<<<<< HEAD
<<<<<<< HEAD
        .join('')}
=======
        .join("")}
>>>>>>> c5fb170 (Fixed url, added about page)
=======
        .join('')}
>>>>>>> e41d63e (Added about, fixed url)
=======
>>>>>>> 6f321e1 (added sitemap.xml)
=======
>>>>>>> a8f01d9 (added sitemap.xml)
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
