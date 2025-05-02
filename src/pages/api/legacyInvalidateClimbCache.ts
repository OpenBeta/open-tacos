import { NextApiRequest, NextApiHandler } from 'next'
import { validate as isValid } from 'uuid'

/**
 * Invalidate legacy climb page (/climbs/<uuid>)
 * @see https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
 * @deprecated
 */
const handler: NextApiHandler = async (req: NextApiRequest, res) => {
  if (!res.writable) return
  const climbUuid = req.query?.c as string
  if (isValid(climbUuid)) {
    await res.revalidate(`/climb/${climbUuid}`)
    res.json({ revalidated: true })
  }
}

export default handler
