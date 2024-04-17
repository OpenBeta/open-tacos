import * as Popover from '@radix-ui/react-popover'
import { MAP_STYLES, type MapStyles } from './MapSelector'
import { useState } from 'react'

interface Props {
  emit: (key: keyof MapStyles) => void
}

const MapLayersSelector: React.FC<Props> = ({ emit }) => {
  const [mapImgUrl, setMapImgUrl] = useState<string>(MAP_STYLES.standard.imgUrl)
  const [mapName, setMapName] = useState<string>('standard')

  const emitMap = (key: string): void => {
    const styleKey = key as keyof MapStyles
    const imgUrl = MAP_STYLES[styleKey].imgUrl

    setMapName(key)
    setMapImgUrl(imgUrl)
    emit(styleKey)
  }
  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className='absolute bottom-20 left-3 bg-white rounded p-1 shadow'>
            <span>
              <img
                className='w-14 h-14 rounded shadow'
                src={mapImgUrl}
                alt='Currently selected maptiler layer'
              />
              <span className={`text-[10px] absolute bottom-2 left-1/2 -translate-x-1/2 ${mapName === 'satellite' ? 'text-white' : ''}`}>{mapName}</span>
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className='p-2 bg-white rounded shadow' side='right' sideOffset={20}>
            <button className=' flex justify-between cursor-pointer'>
              {Object.keys(MAP_STYLES).map((key) => {
                const mapKey = key as keyof typeof MAP_STYLES
                const { imgUrl } = MAP_STYLES[mapKey]
                return (
                  <div className='p-1' key={key} onClick={() => emitMap(key)}>
                    <span className='grid grid-cols-1 justify-items-center'>
                      <img
                        className='w-14 h-14 mb-2 rounded col-span-1 shadow'
                        src={imgUrl}
                        alt='Currently selected maptiler layer'
                      />
                      <span className='col-span-1 text-xs'>{key}</span>
                    </span>
                  </div>
                )
              })}
            </button>
            <Popover.Arrow className='fill-[white]' />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}
export default MapLayersSelector
