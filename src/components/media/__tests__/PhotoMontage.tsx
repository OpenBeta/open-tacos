import { v4 } from 'uuid'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { MediaBaseTag } from '../../../js/types'
import PhotoMontage from '../PhotoMontage'

const photoList: MediaBaseTag[] = [
  {
    id: v4(),
    mediaType: 0,
    destType: 0,
    destination: v4(),
    uid: v4(),
    mediaUrl: '/img1.jpg',
    mediaUuid: '1'
  },
  {
    id: v4(),
    mediaType: 0,
    destType: 0,
    destination: v4(),
    uid: v4(),
    mediaUrl: '/img2.jpg',
    mediaUuid: '2'
  },
  {
    id: v4(),
    mediaType: 0,
    destType: 0,
    destination: v4(),
    uid: v4(),
    mediaUrl: '/img3.jpg',
    mediaUuid: '3'
  },
  {
    id: v4(),
    mediaType: 0,
    destType: 0,
    destination: v4(),
    uid: v4(),
    mediaUrl: '/img4.jpg',
    mediaUuid: '4'
  },
  {
    id: v4(),
    mediaType: 0,
    destType: 0,
    destination: v4(),
    uid: v4(),
    mediaUrl: '/img5.jpg',
    mediaUuid: '5'
  },
  {
    id: v4(),
    mediaType: 0,
    destType: 0,
    destination: v4(),
    uid: v4(),
    mediaUrl: '/img6.jpg',
    mediaUuid: '6'
  }
]

test('PhotoMontage can render 1 photo', async () => {
  render(<PhotoMontage photoList={photoList.slice(0, 1)} isHero />)
  const elements: HTMLImageElement[] = await screen.findAllByRole('img')
  expect(elements.length).toBe(1)
  expect(elements[0].src).toContain(photoList[0].mediaUrl)
})

test('PhotoMontage always renders 2 photos when provided with a list of 2 to 4', async () => {
  render(<PhotoMontage photoList={photoList.slice(0, 3)} isHero />)
  const elements: HTMLImageElement[] = await screen.findAllByRole('img')
  expect(elements.length).toBe(2) // should be 2
})

test('PhotoMontage always renders 5 photos when provided with a list > 5', async () => {
  render(<PhotoMontage photoList={photoList} isHero />)
  const elements: HTMLImageElement[] = await screen.findAllByRole('img')
  expect(elements.length).toBe(5) // should be 5
})
