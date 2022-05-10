/**
 * Regenerate user profile page
 */
export default async function handler (req, res): Promise<any> {
  // Check for token to confirm this is a valid request
  if (req.query.token !== process.env.PAGE_REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.unstable_revalidate(`/u/${encodeURIComponent(req.query.u as string)}`)
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
