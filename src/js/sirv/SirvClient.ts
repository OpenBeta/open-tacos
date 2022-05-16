import axios from 'axios'

export const SIRV_CONFIG = {
  clientId: process.env.NEXT_SIRV_CLIENT_ID != null ? process.env.NEXT_SIRV_CLIENT_ID : '',
  clientSecret: process.env.NEXT_SIRV_CLIENT_SECRET != null ? process.env.NEXT_SIRV_CLIENT_SECRET : ''
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

export const getToken = async (): Promise<string> => {
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
  return ''
}

export const getUserImages = async (uuid: string, token?: string): Promise<any> => {
  let _t = token
  if (token == null) {
    _t = await getToken()
  }
  const res = await client.post(
    '/files/search',
    {
      query: 'dirname:\\/u'
    },
    {
      headers: {
        ...headers,
        Authorization: `bearer ${_t}`
      }
    }
  )

  console.log(res.data.hits)
  return ''
}
