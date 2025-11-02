/**
 * Download a photo from the gallery
 */
export async function downloadPhoto (photoUrl: string, fileName: string): Promise<void> {
  try {
    // If URL is relative, convert to CDN URL
    let fullUrl = photoUrl
    if (!photoUrl.startsWith('http')) {
      const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL
      if (cdnUrl == null || cdnUrl === '') {
        throw new Error('NEXT_PUBLIC_CDN_URL is not configured. Cannot download photo.')
      }
      const mediaPath = photoUrl.replace(/^\/p\//, '/u/')
      fullUrl = cdnUrl + mediaPath
    }

    const link = document.createElement('a')
    link.href = fullUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to download photo:', error)
  }
}
