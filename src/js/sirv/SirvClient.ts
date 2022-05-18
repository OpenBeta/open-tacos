import axios from 'axios'
import { v5 as uuidv5 } from 'uuid'
import { MediaType } from '../types'

export const SIRV_CONFIG = {
  clientId: process.env.SIRV_CLIENT_ID_RO != null ? process.env.SIRV_CLIENT_ID_RO : '',
  clientSecret: process.env.SIRV_CLIENT_SECRET_RO != null ? process.env.SIRV_CLIENT_SECRET_RO : ''
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
    return ''
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
  console.log('Sirv API.getToken() error', res)
  return undefined
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
    return {
      mediaList: [],
      mediaIdList: []
    }
  }

  const res = await client.post(
    '/files/search',
    {
      query: 'dirname:\\/u AND contentType:image',
      sort: {
        ctime: 'asc'
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
    const mediaIdList = []
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

  return {
    mediaList: [],
    mediaIdList: []
  }
}
