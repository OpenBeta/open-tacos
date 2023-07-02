import { NextApiHandler } from 'next'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import { extname } from 'path'
import { getServerSession } from 'next-auth'
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage'
import withAuth from '../withAuth'
import { authOptions } from '../auth/[...nextauth]'

const storage = new Storage({
  credentials: {
    type: 'service_account',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCbs/P8fLXzqAyX\nEBAtYeHzrBGaHDF4A/DiXqYPZpVozogQ3Nj5JjhElHME6wUNiNQcbWgFnU4BiWVF\n9VTSJlf/1lw+7gpwF/gEtQTACSJS+1J7prYdrN/YXq6l1eFrT7icr3YA7+IYE4Ay\nS2CoHnluoaBrZ3Jff30naNT20aP3K4zPd8rTLuCJZAJh/nF/7RWkEzLEv09xzi/h\nk1U1jKOSmHpby8nSI79R6PKXgwO/kI95LbGEFwBVc/YLeHtv3i+vjHbR+KR+EPgc\nquATuDSbsoL4Hn+IUg2AnDQH16SmO+gYFq/dLnufVhO6IxlIOox9oiHN0Oa+93WA\nVybLn78lAgMBAAECggEAA41EWJMjt24y81M7ez2LYPqg4CoaeslkOlW8ZgeKCv0D\nH5daH7zedboJMaiG0fs4E3nvcIlZGTHgLItfJvgW89AZBJp7hHkXgEv80sCiltAC\n3q075EtoQ9BNHZ1WahNEe9aI05alSrVPLFaJ2uvvCzYGqcyPUFxhJ3/9s6+ulNnR\nXMoCTt6y0+kfVPPuRhub/KI5XQHt5j8RvDxOBrMCXNEdNFz/eoVw9N3tabUl/I9P\npv92WpGuL+sVt+lrBX2NriU5pmr5qjpxJaIkWoQIhucNRSAxQmXEqOr6wXIbEOn8\nA3ngiF6pDTH+mLWYbqqq2+GsJqolCmXK/EL7yJ8O9QKBgQDNJMjdNJDiQ/E4xdhU\n6hvBH9iHT8PHX+fgsKRfaUNV5RfneYg9GzjY+CvaxV/RDVeZq7pcQBzhWD4Xlh5I\n+5a3fkfcSucgpwWPyBoVbouLap/SYmgdsECuMwvhsE41ASi+GHQJaiCLrAHXa64F\nho8zHvXEC87GLf/73MYr7NzskwKBgQDCTXduPVpn/eExtZ5IEqt4b01VzG9N0bDi\n6rgejUPQMMJ/HBuB1nBiGjq7wfHvG3uJA4q7fSob+b01cpbTmrWLw90KPE1DP6b/\nhSXFOWZcUSqiK6MjPcc3dVpEOkdsC6Mv6bxVlUTVF0fxLxaHo6+KP+5Jfn13+crj\nSHkrkbswZwKBgFFFvX5FkRDTMgH3/9jEVvKQF0ykQT//svHFiZlzLoYdGPdPorXy\nzvbGezlU8Lz1uDrdWhuqGsb8Gr1lb+IiKnfPw9B2rFK3WPC5qfvLq+Uz/NVwvybj\n6PwapR5optNA/k8xiOch8HrlTmV195+gy6LJJTziIK1LFBtIQAqu8GeZAoGANci1\nv4kyJkkLdfQdHTw1xL+ie5Z8VOEvgpCQaLyXweBNZlwEbTtLnow+J8z2yEYmOvYF\nCAMMjfPiYRIYF/jiOg78d6HbjTroYiCcJOzPncxF7eAAZ3fpVjugwfQT4x+Ri2i6\n3kHUbNvl6Sgsp10y8STjM+rUlkpJ1AIysFHFrA8CgYBdQ+iTLCcSxa1iLwNvyUNV\n65FAtZsYQcDF7Y7QWYngCHsQagL5aSpq8EChxy9ffhXcMsnUBPJ1P0/Xrny3q5un\nDl7Ntxa7UpuxLj5mt+ndQnOL7OIfnNsgInofJJcq9ZjV1uFK0yJScsYhR7rXcnGA\n6ZnkMzx2ElBpbzUJnndOcQ==\n-----END PRIVATE KEY-----\n',
    client_email: 'media-openbeta-staging-rw-3@openbeta.iam.gserviceaccount.com',
    client_id: '101268648477486173745'
  }
})

export interface MediaPreSignedProps {
  url: string
  fullFilename: string
}
/**
 * Generate a pre-signed url for uploading photos to Sirv
 * @returns
 */
const handler: NextApiHandler<MediaPreSignedProps> = async (req, res) => {
  if (req.method === 'GET') {
    try {
      if (req.query?.filename == null) {
        throw new Error('Missing filename query param')
      }
      const { filename } = req.query
      if (Array.isArray(filename)) {
        throw new Error('Expect only 1 filename param')
      }
      const session = await getServerSession(req, res, authOptions)
      if (session?.user?.metadata?.uuid == null) {
        throw new Error('Missing user metadata')
      }
      const { uuid } = session.user.metadata
      const fullFilename = `u/${uuid}/${safeFilename(filename)}`

      const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000 // 15 minutes
      }

      // Get a v4 signed URL for reading the file
      const [url] = await storage
        .bucket(process.env.GC_BUCKET_NAME ?? '')
        .file(fullFilename)
        .getSignedUrl(options)

      console.log('#upload url ', url)

      // const [files] = await storage.bucket('openbeta-staging').getFiles()
      // console.log('#', files.length)
      // const params = {
      //   Bucket: SIRV_CONFIG.s3Bucket, Key: fullFilename, Expires: 60
      // }

      // const url = s3Client.getSignedUrl('putObject', params)
      if (url != null) {
        return res.status(200).json({ url, fullFilename })
      } else {
        throw new Error('Error generating upload url')
      }
    } catch (e) {
      console.log('Uploading to media server failed', e)
      return res.status(500).end()
    }
  }
  return res.status(400).end()
}

export default withAuth(handler)

/**
 * Random filename generator
 */
const safeFilename = (original: string): string => {
  return safeRandomString() + extname(original)
}

const safeRandomString = customAlphabet(nolookalikesSafe, 10)
