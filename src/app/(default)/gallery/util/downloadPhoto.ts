function forceDownload (blobUrl: string, filename: string): void {
  const a: any = document.createElement('a')
  a.download = filename
  a.href = blobUrl
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export default function downloadPhoto (url: string, filename: string): void {
  if (filename !== '') {
    const splitUrl = url.split('\\').pop()?.split('/')
    filename = splitUrl !== undefined ? (splitUrl.pop() ?? '') : ''
  }
  fetch(url, {
    headers: new Headers({
      Origin: location.origin
    }),
    mode: 'cors'
  })
    .then(async (response) => await response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob)
      forceDownload(blobUrl, filename)
    })
    .catch((e) => console.error(e))
}
