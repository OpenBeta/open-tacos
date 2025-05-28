'use client'

import Image from 'next/image'
import React, { useEffect, useRef, MouseEventHandler } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaCarouselType } from 'embla-carousel'
import Link from 'next/link'
import downloadPhoto from '../util/downloadPhoto'
import { MediaWithTags } from '@/js/types'
import {
  PrevButton as EmblaPrevButton,
  NextButton as EmblaNextButton
} from '@/js/hooks/useGalleryNavigation'
import { DownloadIcon, ShareIcon } from '@phosphor-icons/react'

export interface ImageCarouselProps {
  index: number
  images?: MediaWithTags[]
  closeModal: () => void
  navigation: boolean
  onApiInit: (api: EmblaCarouselType) => void
  onPrevButtonClick: MouseEventHandler<HTMLButtonElement>
  onNextButtonClick: MouseEventHandler<HTMLButtonElement>
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  navigateTo: (index: number) => void
}

export default function ImageCarousel ({
  index,
  images,
  closeModal,
  navigation,
  onApiInit,
  onPrevButtonClick,
  onNextButtonClick,
  prevBtnDisabled,
  nextBtnDisabled
}: ImageCarouselProps): JSX.Element | null {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    startIndex: index
  })

  const currentThumbnailRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (emblaApi != null) {
      onApiInit(emblaApi)
    }
  }, [emblaApi, onApiInit])

  useEffect(() => {
    if (emblaApi != null && emblaApi.selectedScrollSnap() !== index) {
      emblaApi.scrollTo(index, true)
    }
  }, [index, emblaApi])

  // Scroll thumbnails into view
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
                src={image.mediaUrl}
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

        {/* Navigation controls */}
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

      {/* Top right controls (Share/Download) */}
      <div className='absolute inset-x-0 top-0 mx-auto max-w-7xl opacity-100'>
        <div className='flex justify-end gap-2 p-2'>
          <Link
            href={fullSizeImageUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='btn btn-ghost btn-square'
            aria-label='Download full size image'
            onClick={(e) => {
              e.preventDefault()
              downloadPhoto(fullSizeImageUrl, currentImage.id)
            }}
          >
            <DownloadIcon size={24} weight='bold' />
          </Link>
          <Link
            href={`/share/${currentImage.id}`}
            className='btn btn-ghost btn-square'
            aria-label='Share image'
          >
            <ShareIcon size={24} weight='bold' />
          </Link>
          <button
            className='btn btn-ghost btn-square'
            onClick={closeModal}
            aria-label='Close image viewer'
            title='Close'
          >
            <span className='sr-only'>Close</span>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {navigation && images.length > 1 && (
        <div className='absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden bg-gradient-to-b from-black/0 to-black/60 pb-4 pt-4'>
          <div className='mx-auto flex h-16 items-center justify-start gap-2 overflow-x-auto px-4 scroll-smooth scrollbar-hide'>
            {images.map((image, i) => {
              const isActive = i === index
              return (
                <button
                  ref={isActive ? currentThumbnailRef : null}
                  key={image.id}
                  onClick={() => emblaApi?.scrollTo(i)}
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
