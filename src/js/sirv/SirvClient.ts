import axios from 'axios'
import { v5 as uuidv5 } from 'uuid'
import { MediaType } from '../types'

if ((process.env.SIRV_CLIENT_ID_RO ?? null) == null && window == null) throw new Error('SIRV_CLIENT_ID_RO not set')
if ((process.env.SIRV_CLIENT_SECRET_RO ?? null) == null && window == null) throw new Error('SIRV_CLIENT_SECRET_RO not set')
if ((process.env.NEXT_PUBLIC_SIRV_BASE_URL ?? null) == null) throw new Error('NEXT_PUBLIC_SIRV_BASE_URL not set')

export const SIRV_CONFIG = {
  clientId: process.env.SIRV_CLIENT_ID_RO ?? null,
  clientSecret: process.env.SIRV_CLIENT_SECRET_RO ?? null,
  baseUrl: process.env.NEXT_PUBLIC_SIRV_BASE_URL ?? null
}

const client = axios.create({
  baseURL: 'https://api.sirv.com/v2',
  headers: {
    'content-type': 'application/json'
  }
})

const headers = {
  'content-type': 'application/json'
}

export const getToken = async (): Promise<string|undefined> => {
  if (SIRV_CONFIG.clientSecret == null) {
    console.log('Missing clientSecret')
    return undefined
  }

  const res = await client.post(
    '/token',
    {
      clientId: SIRV_CONFIG.clientId,
      clientSecret: SIRV_CONFIG.clientSecret
    })
  if (res.status === 200) {
    return res.data.token
  }
  throw new Error('Sirv API.getToken() error' + res.statusText)
}

export interface UserImageReturnType {
  mediaList: MediaType[]
  mediaIdList: string[]
}
export const getUserImages = async (uuid: string, token?: string): Promise<UserImageReturnType> => {
  let _t = token
  if (token == null) {
    _t = await getToken()
  }

  if (_t == null) {
    throw new Error('Sirv API.getUserImages(): unable to get a token')
  }

  const res = await client.post(
    '/files/search',
    {
      query: 'dirname:\\/u AND contentType:image',
      sort: {
        ctime: 'desc'
      }
    },
    {
      headers: {
        ...headers,
        Authorization: `bearer ${_t}`
      }
    }
  )
  if (res.status === 200 && Array.isArray(res.data.hits)) {
    const mediaIdList: string[] = []
    const mediaList = res.data.hits.map(entry => {
      const { filename, ctime, mtime, contentType, meta } = entry._source
      const mediaId = uuidv5(filename, uuidv5.URL)
      mediaIdList.push(mediaId)
      return ({
        ownerId: uuid,
        filename,
        mediaId,
        ctime,
        mtime,
        contentType,
        meta
      })
    })

    return {
      mediaList,
      mediaIdList
    }
  }

  throw new Error('Sirv API.getUserImages() error' + res.statusText)
}
