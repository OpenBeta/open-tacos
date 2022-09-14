import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { validate as isValid } from 'uuid'
import withAuth from './withAuth'
import { checkUsername } from '../../js/utils'

/**
 * Notify backend to regenerate a page.
 * @see https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
 */
const handler: NextApiHandler = async (req: NextApiRequest, res) => {
  try {
    await profileHandler(req, res)
    await areaHandler(req, res)
    await otherPagesHandler(req, res)
    res.end()
  } catch (e) {
    return res.status(500).send('Error revalidating page')
  }
}

const profileHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  if (!res.writable) return
  const username = req.query?.u as string
  if (checkUsername(username)) {
    await res.status(200).revalidate(`/u/${encodeURIComponent(username)}`)
    res.json({ revalidated: true })
  }
}

const areaHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  if (!res.writable) return
  const areaUuid = req.query?.a as string
  if (isValid(areaUuid)) {
    await res.status(200).revalidate(`/areas/${areaUuid}`)
    res.json({ revalidated: true })
  }
}

const otherPagesHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  if (!res.writable) return
  const page = req.query?.page as string
  const ALLOWS = ['/contribs']
  if (ALLOWS.includes(page)) {
    await res.status(200).revalidate(page)
    res.json({ revalidated: true })
  }
}

export default withAuth(handler)
