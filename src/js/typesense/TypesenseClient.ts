import Typesense from 'typesense'

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_NODES,
      port: 443,
      protocol: 'https'
    }
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY,
  numRetries: 3, // A total of 4 tries (1 original try + 3 retries)
  logLevel: 'info'
})

/**
 * Search climbs by name, description, fa, area name
 * @param query search string
 * @returns result group by discipline
 */
export const typesenseSearch = async (query: string): Promise<any> => {
  return await typesenseClient.collections('climbs').documents().search({
    q: query,
    query_by: 'climbName, climbDesc, fa, areaNames',
    exclude_fields: 'climbDesc',
    facet_by: 'disciplines',
    group_by: 'disciplines'
  })
}

/**
 * Search multiple collections in one request
 * @param query
 */
export const multiSearch = async (query: string): Promise<any> => {
  // See https://typesense.org/docs/0.19.0/api/documents.html#federated-multi-search
  const commonSearchParams = {

  }
  const searchRequests = {
    searches: [
      {
        q: query,
        query_by: 'climbName, climbDesc',
        collection: 'climbs',
        exclude_fields: 'climbDesc',
        page: 1,
        per_page: 10
      },
      {
        q: query,
        query_by: 'areaNames',
        collection: 'climbs',
        exclude_fields: 'climbDesc',
        page: 1,
        per_page: 10
      },
      {
        q: query,
        query_by: 'fa',
        collection: 'climbs',
        exclude_fields: 'climbDesc',
        page: 1,
        per_page: 10
      }
    ]
  }

  const rs = await typesenseClient.multiSearch.perform(searchRequests, commonSearchParams)
  return {
    climbs: rs.results[0].hits,
    areas: rs.results[1].hits,
    fa: rs.results[2].hits
  }
}
