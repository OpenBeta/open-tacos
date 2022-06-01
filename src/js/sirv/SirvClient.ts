import axios from 'axios'
import { v5 as uuidv5 } from 'uuid'
import { MediaType } from '../types'

if ((process.env.SIRV_CLIENT_ID_RO ?? null) == null && typeof window === 'undefined') throw new Error('SIRV_CLIENT_ID_RO not set')
if ((process.env.SIRV_CLIENT_SECRET_RO ?? null) == null && typeof window === 'undefined') throw new Error('SIRV_CLIENT_SECRET_RO not set')
if ((process.env.NEXT_PUBLIC_SIRV_BASE_URL ?? null) == null) throw new Error('NEXT_PUBLIC_SIRV_BASE_URL not set')

export const SIRV_CONFIG = {
  clientId: process.env.SIRV_CLIENT_ID_RO ?? null,
  clientSecret: process.env.SIRV_CLIENT_SECRET_RO ?? null,
  clientAdminId: process.env.SIRV_CLIENT_ID_RW ?? null,
  clientAdminSecret: process.env.SIRV_CLIENT_SECRET_RW ?? null,
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

interface TokenParamsType {
  clientId: string | null
  clientSecret: string | null
}

const _validateTokenParams = ({ clientId, clientSecret }: TokenParamsType): boolean =>
  clientId != null && clientSecret != null

export const getToken = async (isAdmin: boolean = false): Promise<string|undefined> => {
  const params: TokenParamsType = isAdmin
    ? {
        clientId: SIRV_CONFIG.clientAdminId,
        clientSecret: SIRV_CONFIG.clientAdminSecret
      }
    : {
        clientId: SIRV_CONFIG.clientId,
        clientSecret: SIRV_CONFIG.clientSecret
      }

  if (!_validateTokenParams(params)) {
    console.log('Missing client token/secret')
    return undefined
  }
  const res = await client.post(
    '/token',
    params)

  if (res.status === 200) {
    return res.data.token
  }
  throw new Error('Sirv API.getToken() error' + res.statusText)
}

export const getAdminToken = async (): Promise<string|undefined> => await getToken(true)

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
      query: `dirname:\\/u\\/${uuid}`,
      sort: {
        ctime: 'desc'
      },
      size: 100
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

export const createUserDir = async (uuid: string, token?: string): Promise<boolean> => {
  let _t = token
  if (token == null) {
    _t = await getAdminToken()
  }

  if (_t == null) {
    throw new Error('Sirv API.getUserImages(): unable to get a token')
  }

  try {
    const res = await client.post(
      `/files/mkdir?dirname=/u/${uuid}`,
      {},
      {
        headers: {
          ...headers,
          Authorization: `bearer ${_t}`
        }
      }
    )

    return res.status === 200
  } catch (e) {
    console.log('Image API createUserDir() failed', e?.response?.status ?? '')
    console.log(e)
    return false
  }
}
