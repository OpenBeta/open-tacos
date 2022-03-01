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

export const typesenseSearch = async (query: string): Promise<any> => {
  return await typesenseClient.collections('climbs').documents().search({
    q: query,
    query_by: 'climbName, climbDesc, fa, areaNames',
    exclude_fields: 'climbDesc',
    facet_by: 'disciplines',
    group_by: 'disciplines'
  })
}
