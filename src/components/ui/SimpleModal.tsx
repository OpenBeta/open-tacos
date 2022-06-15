import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon, XIcon, DotsHorizontalIcon } from '@heroicons/react/outline'

import { MediaType } from '../../js/types'
import { DefaultLoader } from '../../js/sirv/util'
import { Button, ButtonVariant } from '../../components/ui/BaseButton'

interface SimpleModalProps {
  isOpen: boolean
  initialIndex: number
  onClose: () => void
  imageList: MediaType[]
  userinfo: JSX.Element
}

export default function SimpleModal ({ isOpen, onClose, initialIndex, imageList, userinfo }: SimpleModalProps): JSX.Element {
  const [currentImageIndex, setCurrentIndex] = useState<number>(initialIndex)
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  console.log(currentImageIndex)

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      as='div'
      className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto'
    >
      <Dialog.Overlay className='pointer-events-none fixed inset-0 bg-black opacity-60' />
      <Dialog.Panel className='relative flex items-center w-full h-full bg-black max-w-screen-2xl'>
        <div className='block relative w-full h-full aspect-square'>
          {currentImageIndex >= 0 &&
            <ResponsiveImage
              mediaUrl={imageList[currentImageIndex].filename}
              isHero
            />}
        </div>
        <Dialog.Description className='max-w-[400px] min-w-[350px] h-full w-full px-4 py-6 bg-white'>
          {userinfo}
          <div className='absolute right-3 top-2'>
            <Button
              label={<XIcon className='w-6 h-6' />}
              variant={ButtonVariant.ROUNDED_ICON_SOLID}
              onClick={onClose}
            />
          </div>
        </Dialog.Description>
        <NavBar currentImageIndex={currentImageIndex} setCurrentIndex={setCurrentIndex} imageList={imageList} />
      </Dialog.Panel>
    </Dialog>
  )
}

interface NavBarProps {
  currentImageIndex: number
  setCurrentIndex: Dispatch<SetStateAction<number>>
  imageList: MediaType[]
}

const NavBar = ({ currentImageIndex, setCurrentIndex, imageList }: NavBarProps): JSX.Element => (
  <div className='absolute w-full flex items-center justify-between px-2'>
    {currentImageIndex > 0
      ? <Button
        label={<ChevronLeftIcon className='w-8 h-8' />}
        variant={ButtonVariant.ROUNDED_ICON_SOLID}
        onClick={() => setCurrentIndex(current => (current - 1))}
        />
      : <div />}
    {currentImageIndex < imageList.length - 1
      ? <Button
        label={<ChevronRightIcon className='w-8 h-8 ' />}
        variant={ButtonVariant.ROUNDED_ICON_SOLID}
        onClick={() => setCurrentIndex(current => (current + 1))}
        />
      : <div />}
  </div>)

const ResponsiveImage = ({ mediaUrl, isHero = true }): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setLoading(true)
  }, [mediaUrl])
  return (
    <Transition
      show
      enter='transition duration-500 ease-out'
      enterFrom='transform opacity-0'
      enterTo='transform opacity-100'
    >
      <Image
        src={mediaUrl}
        loader={DefaultLoader}
        quality={90}
        layout='fill'
        sizes='100vw'
        objectFit='contain'
        priority={isHero}
        onLoadingComplete={() => setLoading(false)}
      />
      <div className='absolute w-full h-full flex items-center'>
        {isLoading &&
          <div className='mx-auto'>
            <DotsHorizontalIcon className='text-gray-200 w-12 h-12 animate-pulse' />
          </div>}
      </div>
    </Transition>
  )
}
