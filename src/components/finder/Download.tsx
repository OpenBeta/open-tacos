import { saveAs } from 'file-saver'
import { store } from '../../js/stores'

export default function DownloadLink (): JSX.Element {
  return (
    <button
      type='button'
      className='cursor-pointer px-2 py-0.5 rounded-lg text-xs border-2 bg-white dark:border-ob-dark'
      onClick={saveFile}
    >
      Download
    </button>
  )
}

const saveFile = (): void => {
  const blob = new Blob([JSON.stringify(store.filters.allGeoJson())], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, 'climbing-data.geojson')
}
