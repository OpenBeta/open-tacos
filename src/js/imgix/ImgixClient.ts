import axios from 'axios'

export const IMGIX_CONFIG = {
  sourceURL: process.env.NEXT_PUBLIC_IMGIX_SOURCE_URL != null ? process.env.NEXT_PUBLIC_IMGIX_SOURCE_URL : '',
  sourceId: process.env.NEXT_IMGIX_SOURCE_ID != null ? process.env.NEXT_IMGIX_SOURCE_ID : '',
  apiToken: process.env.NEXT_IMGIX_RO_TOKEN != null ? process.env.NEXT_IMGIX_RO_TOKEN : ''
}

const axiosClient = axios.create({
  baseURL: process.env.NEXT_IMGIX_MGMT_API,
  timeout: 10000
})

interface ListPhotoProps {
  uid?: string
  uuid?: string
  limit?: number
}

export const listPhotos = async (
  { uid, limit = 50 }: ListPhotoProps
): Promise<any[]> => {
  if (uid != null) {
    const safeQuery = encodeURI(`filter[metadata:uid]=${uid}`)
    const response = await axiosClient.get(
      `/sources/${IMGIX_CONFIG.sourceId}/assets?${safeQuery}`,
      { headers: { Authorization: `Bearer ${IMGIX_CONFIG.apiToken}` } })
    return response.status === 200
      ? flatten(response?.data)
      : []
  }
  return []
}

const flatten = (response: any): any[] => {
  if (Array.isArray(response?.data)) {
    return response?.data.map(entry => ({ ...entry.attributes }))
  }
  return []
}
