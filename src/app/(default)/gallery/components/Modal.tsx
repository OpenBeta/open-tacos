import {
  CaretCircleLeft,
  CaretCircleRight,
  Download,
  Share
} from '@phosphor-icons/react'
import Image from 'next/image'
import React, { useEffect, useCallback, useRef } from 'react' // Added useCallback
import useEmblaCarousel from 'embla-carousel-react'
import downloadPhoto from '../util/downloadPhoto'
import { MediaWithTags } from '@/js/types'
import { usePrevNextButtons } from '@/components/carousel/useNextPrevButtons'
import Link from 'next/link'

export interface SharedModalProps {
  index: number
  images?: MediaWithTags[]
  currentPhoto?: MediaWithTags
  changePhotoId: (newVal: number) => void
  closeModal: () => void
  navigation: boolean
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

  const {
    prevBtnDisabled,
    nextBtnDisabled
  } = usePrevNextButtons(emblaApi)
  const currentThumbnailRef = useRef<HTMLButtonElement>(null)

  const PrevButton: React.FC<{ onClick: () => void, disabled: boolean }> = ({ onClick, disabled }) => (
    <button
      className='btn btn-circle btn-ghost absolute left-3 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:pointer-events-none'
      onClick={onClick}
      disabled={disabled}
      aria-label='Previous image'
    >
      <CaretCircleLeft color='white' className='h-6 w-6' />
    </button>
  )

  const NextButton: React.FC<{ onClick: () => void, disabled: boolean }> = ({ onClick, disabled }) => (
    <button
      className='btn btn-circle btn-ghost absolute right-3 top-1/2 -translate-y-1/2 z-10 backdrop-blur-sm bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:pointer-events-none'
      onClick={onClick}
      disabled={disabled}
      aria-label='Next image'
    >
      <CaretCircleRight color='white' className='h-6 w-6' />
    </button>
  )

  // Scroll the active thumbnail into view in the bottom bar
  useEffect(() => {
    if (currentThumbnailRef.current != null) {
      currentThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [index])
  const scrollPrev = useCallback(() => {
    changePhotoId(index - 1)
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    changePhotoId(index + 1)
    emblaApi?.scrollNext()
  }, [emblaApi])

  const currentImage = images?.[index]

  if (currentImage == null) {
    return null
  }

  const fullSizeImageUrl = `${currentImage.mediaUrl}`

  return (
    // Outer container, relative for positioning controls
    <div className='relative flex flex-col justify-center items-center w-full h-full'>

      {/* Embla Carousel Viewport */}
      <div className='embla overflow-hidden relative w-full max-w-7xl aspect-[3/2]' ref={emblaRef}>
        <div className='embla__container flex h-full'>
          {images?.map((image, i) => (
            <div className='embla__slide flex-[0_0_100%] min-w-0 relative flex justify-center items-center' key={image.id}>
              <Image
                src={`${image.mediaUrl}`}
                fill
                style={{ objectFit: 'contain' }}
                priority={i === index}
                alt={`Image ${i + 1}`}
                onError={() => console.error(`Failed to load image: ${image.id}`)}
              />
            </div>
          ))}
        </div>

        {/* Embla's Prev/Next Buttons */}
        {navigation && (images != null) && images.length > 1 && (

          <div className='embla__controls'>
            <div className='embla__buttons'>
              <PrevButton onClick={scrollPrev} disabled={prevBtnDisabled} />
              <NextButton onClick={scrollNext} disabled={nextBtnDisabled} />
            </div>
          </div>
        )}
      </div>

      {/* Absolutely Positioned Top Bar Controls */}
      <div className='absolute inset-x-0 top-0 mx-auto max-w-7xl transition-opacity duration-300 ease-in-out opacity-100}'>
        <div className='relative w-full h-0'>
          <div className='absolute top-0 right-0 flex items-center gap-2 p-3'>
            {navigation &&
              <Link
                href={`${fullSizeImageUrl}`}
                className='btn btn-sm btn-circle btn-ghost backdrop-blur-sm bg-black/30 hover:bg-black/50 text-white'
                target='_blank' title='Open fullsize version' rel='noreferrer' aria-label='Open fullsize image in new tab'
              >
                <Share className='h-5 w-5' />
              </Link>}
            <button
              onClick={() => downloadPhoto(fullSizeImageUrl, `${currentImage.id}.jpg`)}
              className='btn btn-sm btn-circle btn-ghost backdrop-blur-sm bg-black/30 hover:bg-black/50 text-white'
              title='Download fullsize version' aria-label='Download fullsize image'
            >
              <Download className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav bar (Thumbnails) */}
      {navigation && (images != null) && images.length > 1 && (
        <div className='absolute bottom-0 left-0 right-0 z-10 w-full overflow-hidden bg-gradient-to-b from-black/0 to-black/60 pb-4 pt-4'>
          <div className='mx-auto flex h-16 items-center justify-start gap-2 overflow-x-auto px-4 scroll-smooth scrollbar-hide'>
            {images.map((image, i) => {
              const isActive = i === index
              return (
                <button
                  ref={isActive ? currentThumbnailRef : null}
                  key={image.id}
                  onClick={() => {
                    if (emblaApi != null) emblaApi.scrollTo(i)
                    changePhotoId(i)
                  }}
                  className={`btn btn-ghost btn-square h-14 w-20 flex-shrink-0 p-0 overflow-hidden relative transition-transform duration-150 ease-in-out ${isActive ? 'scale-110 border-2 border-white' : 'scale-100 opacity-60 hover:opacity-100'
                    }`}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  <Image
                    alt={`Thumbnail image ${i + 1}`}
                    width={100}
                    height={75}
                    className='h-full w-full object-cover'
                    src={`${image.mediaUrl}`}
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
