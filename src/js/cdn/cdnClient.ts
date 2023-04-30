import axios from 'axios'
import { SIRV_CONFIG } from '../sirv/SirvClient'
export const httpClient = axios.create({
  baseURL: SIRV_CONFIG.baseUrl
})

// const storage = new Storage()
// /**
//  *
//  * @param fileList
//  * @param token
//  * @returns
//  */
// export const getImagesByFilenames = async (fileList: string[]): Promise <{ mediaList: MediaType[], idList: string[]}> => {
//   if (fileList.length === 0) {
//     return {
//       mediaList: [],
//       idList: []
//     }
//   }

//   const [files] = await storage.bucket('openbeta-staging').getFiles({ autoPaginate: false })

//   const result = files.reduce<string[]>((acc, curr) => {
//     if (curr.name.endsWith('uid.json')) {
//       return acc
//     }
//     acc.push(curr.name)
//     return acc
//   }, [])

//   console.log('##', result)
//   return { mediaList: [], idList: [] }
// }
