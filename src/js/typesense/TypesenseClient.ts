import Typesense from 'typesense'
import { TypesenseDocumentType } from '../types'

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_NODES ?? '',
      port: 443,
      protocol: 'https'
    }
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY ?? '',
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

export const climbSearchByName = async (query: string): Promise<any> => {
  const rs = await typesenseClient.collections('climbs').documents().search({
    q: query,
    query_by: 'climbName,disciplines,areaNames',
    exclude_fields: 'climbDesc,fa'
  })
  return rs?.hits?.map(hit => hit.document) ?? []
}

export const areaSearchByName = async (query: string, latlng: number[]): Promise<any> => {
  const rs = await typesenseClient.collections('climbs').documents().search({
    q: query,
    query_by: 'areaNames',
    exclude_fields: 'disciplines, climbName, climbDesc, fa',
    sort_by: `cragLatLng(${latlng[0]}, ${latlng[1]}):asc`
  })
  return rs?.hits?.map(hit => hit.document) ?? []
}

interface multisearchRet {
  climbs: TypesenseDocumentType[]
  areas: TypesenseDocumentType[]
  fa: TypesenseDocumentType[]
}

/**
 * Search multiple collections in one request
 * @param query
 */
export async function multiSearch (query: string): Promise<multisearchRet> {
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
        per_page: 7
      },
      {
        q: query,
        query_by: 'areaNames',
        collection: 'climbs',
        exclude_fields: 'climbDesc',
        page: 1,
        per_page: 5
      },
      {
        q: query,
        query_by: 'fa',
        collection: 'climbs',
        exclude_fields: 'climbDesc',
        page: 1,
        per_page: 5
      }
    ]
  }

  const rs = await typesenseClient.multiSearch.perform(searchRequests, commonSearchParams)
  // FYI: rs.results contains a lot more useful data
  const x: multisearchRet = {
    climbs: rs?.results[0].hits?.map(hit => hit.document) ?? [],
    areas: rs?.results[1].hits?.map(hit => hit.document) ?? [],
    fa: rs?.results[2].hits?.map(hit => hit.document) ?? []
  } as any

  return x
}
