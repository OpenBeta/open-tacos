import { render, screen } from '@testing-library/react'
import type PhotoMontageType from '../PhotoMontage'
import { mediaList } from './data'

let PhotoMontage: typeof PhotoMontageType

jest.mock('../BaseUploader', () => ({
  __esModule: true,
  BaseUploaderWithNext13Context: () => <div />
}))

describe('PhotoMontage tests', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../PhotoMontage')
    PhotoMontage = module.default
  })

  test('PhotoMontage can render 1 photo', async () => {
    render(<PhotoMontage photoList={mediaList.slice(0, 1)} />)
    const elements: HTMLImageElement[] = await screen.findAllByRole('img')
    expect(elements.length).toBe(1)
    expect(elements[0].src).toMatch(encodeURIComponent(mediaList[0].mediaUrl))
  })

  test('PhotoMontage always renders 2 photos when provided with a list of 2 to 4', async () => {
    render(<PhotoMontage photoList={mediaList.slice(0, 3)} />)
    const elements: HTMLImageElement[] = await screen.findAllByRole('img')
    expect(elements.length).toBe(2) // should be 2
  })

  test('PhotoMontage always renders 5 photos when provided with a list > 5', async () => {
    render(<PhotoMontage photoList={mediaList} />)
    const elements: HTMLImageElement[] = await screen.findAllByRole('img')
    expect(elements.length).toBe(5) // should be 5
  })
})
