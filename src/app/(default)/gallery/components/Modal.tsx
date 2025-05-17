'use client'

import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Link from 'next/link'
import downloadPhoto from '../util/downloadPhoto'
import { MediaWithTags } from '@/js/types'
import {
  usePrevNextButtons,
  PrevButton as EmblaPrevButton,
  NextButton as EmblaNextButton
} from '@/components/carousel/useNextPrevButtons'
import { Download, Share } from '@phosphor-icons/react'

export interface SharedModalProps {
  index: number
  images?: MediaWithTags[]
  changePhotoId: (newVal: number) => void
  closeModal: () => void
  navigation: boolean
  currentPhoto?: MediaWithTags
  direction?: number
}

export default function SharedModal ({
  index,
  images,
  changePhotoId,
  navigation
}: SharedModalProps): JSX.Element | null {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    startIndex: index
  })

  const currentThumbnailRef = useRef<HTMLButtonElement>(null)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  useEffect(() => {
    if (emblaApi == null) return

    const handleEmblaSlideSelect = (): void => {
      const newSelectedSnap = emblaApi.selectedScrollSnap()
      if (newSelectedSnap !== index) {
        console.log(`SharedModal: Embla selected snap ${newSelectedSnap}, current prop index ${index}. Calling changePhotoId.`)
        changePhotoId(newSelectedSnap)
      }
    }

    emblaApi.on('select', handleEmblaSlideSelect)
    emblaApi.on('reInit', handleEmblaSlideSelect)

    return () => {
      if (emblaApi != null) {
        emblaApi.off('select', handleEmblaSlideSelect)
        emblaApi.off('reInit', handleEmblaSlideSelect)
      }
    }
  }, [emblaApi, changePhotoId, index])

  useEffect(() => {
    if (emblaApi != null && emblaApi.selectedScrollSnap() !== index) {
      console.log(`SharedModal: Index prop changed to ${index}, Embla at ${emblaApi.selectedScrollSnap()}. Scrolling Embla.`)
      emblaApi.scrollTo(index, true)
    }
  }, [index, emblaApi])

  useEffect(() => {
    if (currentThumbnailRef.current != null) {
      currentThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [index])

  const currentImage = images?.[index]

  if (images == null || images.length === 0) {
    return <div className='flex items-center justify-center h-full text-white/70 bg-black'>No images provided.</div>
  }

  if (currentImage == null) {
    console.warn(`SharedModal: currentImage is null. Index: ${index}, Images count: ${images.length}`)
    return <div className='flex items-center justify-center h-full text-white/70 bg-black'>Image not found or invalid index.</div>
  }

  const fullSizeImageUrl = currentImage.mediaUrl

  return (
    <div className='relative flex flex-col justify-center items-center w-full h-full'>
      <div className='embla overflow-hidden relative w-full max-w-7xl aspect-[3/2]' ref={emblaRef}>
        <div className='embla__container flex h-full'>
          {images.map((image, i) => (
            <div className='embla__slide flex-[0_0_100%] min-w-0 relative flex justify-center items-center' key={image.id}>
              <Image
                src={fullSizeImageUrl}
                fill
                style={{ objectFit: 'contain' }}
                priority={i === index}
                alt={`Image ${i + 1}`}
                onError={() => console.error(`Failed to load image: ${image.id}`)}
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw'
              />
            </div>
          ))}
        </div>

        {navigation && images.length > 1 && (
          <div className='embla__controls absolute inset-0 flex items-center justify-between px-1 md:px-3 pointer-events-none'>
            <div className='pointer-events-auto'>
              <EmblaPrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            </div>
            <div className='pointer-events-auto'>
              <EmblaNextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>
          </div>
        )}
      </div>

      <div className='absolute inset-x-0 top-0 mx-auto max-w-7xl opacity-100'>
        <div className='relative w-full h-0'>
          <div className='absolute top-0 right-0 flex items-center gap-2 p-3'>
            {navigation && fullSizeImageUrl != null && (
              <Link
                href={fullSizeImageUrl}
                className='btn btn-sm btn-circle btn-ghost backdrop-blur-sm bg-black/30 hover:bg-black/50 text-white'
                target='_blank' title='Open fullsize version' rel='noreferrer' aria-label='Open fullsize image in new tab'
              >
                <Share className='h-5 w-5' />
              </Link>
            )}
            <button
              onClick={() => {
                if (fullSizeImageUrl != null && currentImage.id != null) {
                  downloadPhoto(fullSizeImageUrl, `${currentImage.id}.jpg`)
                }
              }}
              disabled={fullSizeImageUrl == null}
              className='btn btn-sm btn-circle btn-ghost backdrop-blur-sm bg-black/30 hover:bg-black/50 text-white disabled:opacity-50'
              title='Download fullsize version' aria-label='Download fullsize image'
            >
              <Download className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>

      {navigation && images.length > 1 && (
        <div className='absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden bg-gradient-to-b from-black/0 to-black/60 pb-4 pt-4'>
          <div className='mx-auto flex h-16 items-center justify-start gap-2 overflow-x-auto px-4 scroll-smooth scrollbar-hide'>
            {images.map((image, i) => {
              const isActive = i === index
              return (
                <button
                  ref={isActive ? currentThumbnailRef : null}
                  key={image.id}
                  onClick={() => {
                    if (emblaApi != null) {
                      emblaApi.scrollTo(i)
                    }
                  }}
                  className={`btn btn-ghost btn-square h-14 w-20 flex-shrink-0 p-0 overflow-hidden relative transition-transform duration-150 ease-in-out ${isActive ? 'scale-110 border-2 border-white' : 'scale-100 opacity-60 hover:opacity-100'}`}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  <Image
                    alt={`Thumbnail image ${i + 1}`}
                    width={100} height={75}
                    className='h-full w-full object-cover'
                    src={image.mediaUrl}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
