import { v4 } from 'uuid'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import PhotoMontage from '../PhotoMontage'
import { mediaList } from './data'

test('PhotoMontage can render 1 photo', async () => {
  render(<PhotoMontage photoList={mediaList.slice(0, 1)} isHero />)
  const elements: HTMLImageElement[] = await screen.findAllByRole('img')
  expect(elements.length).toBe(1)
  expect(elements[0].src).toContain(mediaList[0].mediaUrl)
})

test('PhotoMontage always renders 2 photos when provided with a list of 2 to 4', async () => {
  render(<PhotoMontage photoList={mediaList.slice(0, 3)} isHero />)
  const elements: HTMLImageElement[] = await screen.findAllByRole('img')
  expect(elements.length).toBe(2) // should be 2
})

test('PhotoMontage always renders 5 photos when provided with a list > 5', async () => {
  render(<PhotoMontage photoList={mediaList} isHero />)
  const elements: HTMLImageElement[] = await screen.findAllByRole('img')
  expect(elements.length).toBe(5) // should be 5
})
