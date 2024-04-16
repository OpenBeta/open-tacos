import * as HoverCard from '@radix-ui/react-hover-card'
import { MAP_STYLES, type MapStyles } from './MapSelector'

interface Props {
  emit: (key: keyof MapStyles) => void
}

const MapLayersSelector: React.FC<Props> = ({ emit }) => {
  const emitMap = (key: string): void => {
    const styleKey = key as keyof MapStyles
    emit(styleKey)
  }

  return (
    <>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <span className='absolute bottom-20 left-3 bg-slate-100 rounded'>
            <img
              className='w-6 h-6'
              src='https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png'
              alt='Radix UI'
            />
          </span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className='p-4 bg-slate-100 ' side='right' sideOffset={20}>
            <div className=' flex justify-between'>
              {Object.keys(MAP_STYLES).map((key) => (
                <div className=' p-2' key={key} onClick={() => emitMap(key)}>
                  {key}
                </div>
              ))}
            </div>
            <HoverCard.Arrow />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>

    </>
  )
}
export default MapLayersSelector
