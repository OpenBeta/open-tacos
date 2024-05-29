import * as Popover from '@radix-ui/react-popover'
import { MAP_STYLES, type MapStyles } from './MapSelector'
import { useState } from 'react'

interface Props {
  emit: (key: keyof MapStyles) => void
}

const MapLayersSelector: React.FC<Props> = ({ emit }) => {
  const [mapImgUrl, setMapImgUrl] = useState<string>(MAP_STYLES.light.imgUrl)
  const [mapName, setMapName] = useState<string>('light')

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
          <button className='absolute bottom-20 left-3 bg-base-100 rounded p-1.5 shadow'>
            <span>
              <img
                className='w-12 h-12 md:w-16 md:h-16 rounded border-[1px] border-base-300'
                src={mapImgUrl}
                alt='Currently selected maptiler layer'
              />
              <span className={`break-word text-[0.65rem] absolute bottom-2 left-1/2 -translate-x-1/2 ${mapName === 'satellite' ? 'text-base-100' : ''}`}>{mapName}</span>
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className=' pt-1.5 bg-base-100 rounded grid grid-cols-1' side='top' sideOffset={20}>
            <button className='cursor-pointer col-span-1'>
              {Object.keys(MAP_STYLES).map((key) => {
                const mapKey = key as keyof typeof MAP_STYLES
                const { imgUrl } = MAP_STYLES[mapKey]
                return (
                  <div className='px-1.5' key={key} onClick={() => emitMap(key)}>
                    <span className='grid grid-cols-1 justify-items-center'>
                      <img
                        className={`w-12 h-12 md:w-16 md:h-16 rounded col-span-1 shadow border-base-300 ${mapKey === mapName ? 'border-2' : ''}`}
                        src={imgUrl}
                        alt='Currently selected maptiler layer'
                      />
                      <span className='col-span-1 text-[0.65rem] '>{key}</span>
                    </span>
                  </div>
                )
              })}
            </button>
            <Popover.Arrow className='fill-[base-100]' />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}
export default MapLayersSelector
