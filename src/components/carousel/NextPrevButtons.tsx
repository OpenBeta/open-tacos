import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import clx from 'classnames'
import { Icon } from '@phosphor-icons/react'

interface UsePrevNextButtonsType {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (emblaApi == null) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (emblaApi == null) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (emblaApi == null) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

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
      className={clx('h-full px-2', !disabled && 'hover:bg-base-300/40')}
      type='button'
      disabled={disabled ?? false}
      {...restProps}
    >
      <IconComponent weight='bold' size={24} className={clx('text-base-100', disabled && 'opacity-20')} />
    </button>
  )
}
