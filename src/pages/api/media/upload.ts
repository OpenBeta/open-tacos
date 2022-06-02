import getRawBody from 'raw-body'
import { NextApiHandler } from 'next'
import { upload } from '../../../js/sirv/SirvClient'

// We need to disable the default body parser
export const config = {
  api: {
    bodyParser: false
  }
}

const handler: NextApiHandler<any> = async (req, res) => {
  if (req.method === 'POST') {
    const { filename } = req.query
    try {
      const rawRes = await getRawBody(req, {
        length: req.headers['content-length'],
        limit: '8mb'
      })
      const photoUrl = await upload(filename as string, rawRes)
      res.status(200).send(photoUrl)
    } catch (e) {
      console.log('#Uploading to media server fail', e)
      res.status(500).end()
    }
  }
}

export default handler
