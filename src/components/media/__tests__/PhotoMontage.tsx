import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import PhotoMontage from '../PhotoMontage'

const photoList = [
  {
    mediaUrl: '/img1.jpg',
    mediaUuid: '1'
  },
  {
    mediaUrl: '/img2.jpg',
    mediaUuid: '2'
  },
  {
    mediaUrl: '/img3.jpg',
    mediaUuid: '3'
  },
  {
    mediaUrl: '/img4.jpg',
    mediaUuid: '4'
  },
  {
    mediaUrl: '/img5.jpg',
    mediaUuid: '5'
  },
  {
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
