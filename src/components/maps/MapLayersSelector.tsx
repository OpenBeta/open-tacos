import * as HoverCard from '@radix-ui/react-hover-card'
import { MAP_STYLES, type MapStyles } from './MapSelector'
import { useState } from 'react'

interface Props {
  emit: (key: keyof MapStyles) => void
}

const MapLayersSelector: React.FC<Props> = ({ emit }) => {
  const [mapImgUrl, setMapImgUrl] = useState<string>(MAP_STYLES.dataviz.imgUrl)
  const [mapName, setMapName] = useState<string>('dataviz')

  const emitMap = (key: string): void => {
    const styleKey = key as keyof MapStyles
    const imgUrl = MAP_STYLES[styleKey].imgUrl

    setMapName(key)
    setMapImgUrl(imgUrl)
    emit(styleKey)
  }

  return (
    <>
      <HoverCard.Root openDelay={0}>
        <HoverCard.Trigger asChild>
          <span className='absolute bottom-20 left-3 bg-white rounded p-1'>
            <span>
              <img
                className='w-12 h-12 rounded'
                src={mapImgUrl}
                alt='Currently selected maptiler layer'
              />
              <span className=' text-[10px] absolute bottom-2 left-1/2 -translate-x-1/2'>{mapName}</span>
            </span>
          </span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className='p-2 bg-white rounded' side='right' sideOffset={20}>
            <button className=' flex justify-between cursor-pointer'>
              {Object.keys(MAP_STYLES).map((key) => {
                const mapKey = key as keyof typeof MAP_STYLES
                const { imgUrl } = MAP_STYLES[mapKey]
                return (
                  <div className='p-1' key={key} onClick={() => emitMap(key)}>
                    <span className='grid grid-cols-1 justify-items-center'>
                      <img
                        className='w-12 h-12 mb-2 rounded col-span-1'
                        src={imgUrl}
                        alt='Currently selected maptiler layer'
                      />
                      <span className='col-span-1 text-xs'>{key}</span>
                    </span>
                  </div>
                )
              })}
            </button>
            <HoverCard.Arrow className=' fill-[white]' />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  )
}
export default MapLayersSelector
