import React, {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import clx from 'classnames'
import { Icon } from '@phosphor-icons/react'
import { MediaWithTags } from '@/js/types'
import { useSearchParams } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'

interface UseGalleryNavigationProps {
  initialIndex: number
  imageList: MediaWithTags[]
  galleryType: 'area' | 'climb' | 'user'
  uuid: string
  emblaApi: EmblaCarouselType | undefined
  hotkeysEnabled?: boolean
}

interface UseGalleryNavigationReturn {
  activeIndex: number
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: MouseEventHandler<HTMLButtonElement>
  onNextButtonClick: MouseEventHandler<HTMLButtonElement>
  navigateTo: (index: number) => void
}

/**
 * Manages carousel state, navigation, URL updates, Embla integration, and hotkeys.
 */
export const useGalleryNavigation = ({
  initialIndex,
  imageList,
  galleryType,
  uuid,
  emblaApi,
  hotkeysEnabled = true
}: UseGalleryNavigationProps): UseGalleryNavigationReturn => {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const currentWindowSearchParams = useSearchParams()

  /**
   * Updates the URL and sets the active index.
   * This is the primary way to change the "logical" slide.
   */
  const navigateTo = useCallback((newIndex: number) => {
    // Check bounds and if index actually changed
    if (imageList == null || newIndex < 0 || newIndex >= imageList.length || newIndex === activeIndex) {
      return
    }

    const newPhoto = imageList[newIndex]
    if (newPhoto?.id != null && newPhoto.id !== '' && newPhoto.mediaUrl != null) {
      const newSearchParams = new URLSearchParams(currentWindowSearchParams.toString())
      newSearchParams.set('type', galleryType)
      const newPhotoPath = `/gallery/${uuid}/${newPhoto.id}`
      const finalUrl = `${newPhotoPath}?${newSearchParams.toString()}`

      // Update URL without page reload
      window.history.replaceState({}, '', finalUrl)

      // Set the new active index
      setActiveIndex(newIndex)
    }
  }, [imageList, activeIndex, currentWindowSearchParams, galleryType, uuid])

  /**
   * Handles Embla's 'select' event: Updates button states and calls navigateTo
   * to sync URL and activeIndex with Embla's visual state.
   */
  const handleEmblaSelect = useCallback((api: EmblaCarouselType) => {
    setPrevBtnDisabled(!api.canScrollPrev())
    setNextBtnDisabled(!api.canScrollNext())
    navigateTo(api.selectedScrollSnap())
  }, [navigateTo])

  /**
   * Sets up Embla event listeners.
   */
  useEffect(() => {
    if (emblaApi == null) return

    emblaApi.on('select', handleEmblaSelect)
    emblaApi.on('reInit', handleEmblaSelect)

    // Set initial state
    handleEmblaSelect(emblaApi)

    return () => {
      emblaApi.off('select', handleEmblaSelect)
      emblaApi.off('reInit', handleEmblaSelect)
    }
  }, [emblaApi, handleEmblaSelect])

  /**
   * Handles Prev/Next button clicks by telling Embla to scroll.
   * Embla's 'select' event will then handle the state/URL update.
   */
  const onPrevButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.stopPropagation()
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.stopPropagation()
    emblaApi?.scrollNext()
  }, [emblaApi])

  /**
   * Handles Hotkeys by telling Embla to scroll.
   */
  useHotkeys('left', () => {
    emblaApi?.scrollPrev()
  },
  { enabled: hotkeysEnabled && (emblaApi != null) },
  [emblaApi, hotkeysEnabled]
  )

  useHotkeys('right', () => {
    emblaApi?.scrollNext()
  },
  { enabled: hotkeysEnabled && (emblaApi != null) },
  [emblaApi, hotkeysEnabled]
  )

  return {
    activeIndex,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
    navigateTo
  }
}

/*
* Button Components for Prev/Next Navigation
*/
type PropType = PropsWithChildren<React.DetailedHTMLProps<
React.ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement>>

export const PrevButton: React.FC<PropType> = (props) => <BaseButton {...props} icon={CaretLeft} />

export const NextButton: React.FC<PropType> = (props) => <BaseButton {...props} icon={CaretRight} />

const BaseButton: React.FC<PropType & {
  icon: Icon
}> = (props) => {
  const { icon: IconComponent, children, disabled = false, ...restProps } = props

  return (
    <button
      className={clx('h-full px-2', !disabled && 'hover:bg-base-300/60')}
      type='button'
      disabled={disabled ?? false}
      {...restProps}
    >
      <IconComponent weight='bold' size={24} className={clx('text-base-100', disabled && 'opacity-20')} />
    </button>
  )
}
