/**
 * Download a photo from the gallery
 */
export async function downloadPhoto (photoUrl: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(photoUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download photo:', error)
  }
}
