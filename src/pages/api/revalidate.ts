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
    await areaAndClimbHandler(req, res)
    await otherPagesHandler(req, res)
    res.end()
  } catch (e) {
    return res.status(500).send('Error revalidating page')
  }
}

/**
 * Send a fetch('/api/revalidate?u=<username>') to regenerate the user page
 */
const profileHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  if (!res.writable) return
  const username = req.query?.u as string
  if (checkUsername(username)) {
    await res.status(200).revalidate(`/u/${encodeURIComponent(username)}`)
    res.json({ revalidated: true })
  }
}

/**
 * Send a fetch('/api/revalidate?a=<areaID>') to regenerate the area page
 */
const areaAndClimbHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  if (!res.writable) return
  const areaUuid = req.query?.a as string
  const sectorUuid = req.query?.s as string
  const climbUuid = req.query?.c as string
  if (isValid(areaUuid)) {
    await res.status(200).revalidate(`/areas/${areaUuid}`)
    res.json({ revalidated: true })
  }
  if (isValid(sectorUuid)) {
    await res.status(200).revalidate(`/crag/${sectorUuid}`)
    res.json({ revalidated: true })
  }
  if (isValid(climbUuid)) {
    await res.status(200).revalidate(`/climbs/${climbUuid}`)
    res.json({ revalidated: true })
  }
}

/**
 * Send a fetch('/api/revalidate?page=edit') to regenerate the edit history.
 * Need to whitelist the page in `ALLOWS` array.
 */
const otherPagesHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  if (!res.writable) return
  const page = req.query?.page as string
  const ALLOWS = ['/edit']
  if (ALLOWS.includes(page)) {
    await res.status(200).revalidate(page)
    res.json({ revalidated: true })
  }
}

export default withAuth(handler)
