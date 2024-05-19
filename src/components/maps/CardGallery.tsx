import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import clx from 'classnames'

import { usePrevNextButtons, PrevButton, NextButton } from '../carousel/useNextPrevButtons'
import { MediaWithTagsInMapTile } from './TileTypes'

export const CardGallery: React.FC<{ media: MediaWithTagsInMapTile[] }> = () => {
  return (
    <section>
      TBD
    </section>
  )
}

export const MiniCarousel: React.FC<{ mediaList: MediaWithTagsInMapTile[] }> = ({ mediaList }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, align: 'start' })
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)
  if (mediaList.length === 0) return null
  const isSingle = mediaList.length === 1
  return (
    <section className='overflow-hidden relative' ref={emblaRef}>
      <div className='flex h-28 gap-x-1'>
        {mediaList.map((m) => (<Slide key={m._id} media={m} isSingle={isSingle} />))}
      </div>
      {!isSingle && (
        <div className='absolute top-0 left-0 w-full h-full flex justify-between'>
          <PrevButton disabled={prevBtnDisabled} onClick={onPrevButtonClick} />
          <NextButton disabled={nextBtnDisabled} onClick={onNextButtonClick} />
        </div>)}
    </section>
  )
}

/**
 * Individual slide.  The flex basis determines the width of the slide in
 * relation to the parent container (viewport). Less than 100% allows us to
 * see the next slide.
 * @see https://www.embla-carousel.com/guides/slide-sizes/
 */
const Slide: React.FC<{ media: MediaWithTagsInMapTile, isSingle: boolean }> = ({ media, isSingle }) => {
  const { mediaUrl, width, height } = media
  return (
    <div className={clx('grow-0 shrink-0  min-w-0 h-28 bg-base-200',
      isSingle ? 'basis-full' : 'basis-5/6'
    )}
    >
      <Image
        src={mediaUrl}
        alt='media'
        width={width}
        height={height}
        sizes='10vw'
      />
    </div>
  )
}
