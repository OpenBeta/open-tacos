import axios from 'axios'
import { IUserProfile, IWritableUserMetadata } from '../types/User'

const client = axios.create({
  headers: {
    'content-type': 'application/json'
  }
})

export const getUserProfile = async (): Promise<IUserProfile | null> => {
  const res = await client.get<IUserProfile>('/api/user/profile')
  if (res.status === 200) {
    return res.data
  }
  return null
}

export const updateUserProfile = async (profile: IWritableUserMetadata): Promise<IUserProfile | null> => {
  const res = await client.patch<IUserProfile>(
    '/api/user/profile',
    profile)
  if (res.status === 200) {
    return res.data
  }
  return null
}
