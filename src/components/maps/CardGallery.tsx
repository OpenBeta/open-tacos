import useEmblaCarousel from 'embla-carousel-react'
import { MediaWithTags } from '@/js/types'
import Image from 'next/image'
import clx from 'classnames'

import { usePrevNextButtons, PrevButton, NextButton } from '../carousel/NextPrevButtons'

export const CardGallery: React.FC<{ media: MediaWithTags[] }> = () => {
  return (
    <section>
      foo
    </section>
  )
}

export const MiniCarousel: React.FC<{ mediaList: MediaWithTags[] }> = ({ mediaList }) => {
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
        {mediaList.map((m) => (<Slide key={m.id} media={m} isSingle={isSingle} />))}
      </div>
      {!isSingle && (
        <div className='absolute top-0 left-0 w-full h-full flex justify-between'>
          <PrevButton disabled={prevBtnDisabled} onClick={onPrevButtonClick} />
          <NextButton disabled={nextBtnDisabled} onClick={onNextButtonClick} />
        </div>)}
    </section>
  )
}

const Slide: React.FC<{ media: MediaWithTags, isSingle: boolean }> = ({ media, isSingle }) => {
  const { mediaUrl, width, height } = media
  return (
    <div className={clx('grow-0 shrink-0 basis-full min-w-0 h-28 bg-base-200',
      isSingle ? 'basis-full' : 'basis-5/6')}
    >
      <Image
        src={mediaUrl}
        alt='media'
        width={width}
        height={height}
        layout='responsive'
        sizes='10vw'
      />
    </div>
  )
}
