import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Description from '../Description'

const loremIpsum49Words = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aenean sed adipiscing diam donec adipiscing tristique risus. Vestibulum sed arcu non odio. Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit lectus. Amet consectetur adipiscing elit duis tristique sollicitudin. '

test('Description renders and shows words', async () => {
  render(
    <Description cont={loremIpsum49Words} maxLength={50} />
  )
  const paragraphContent = screen.getByText(/sed do eiusmod tempor incididunt ut labore et dolore magna aliqua/i)
  expect(paragraphContent).toBeInTheDocument()
})

test('See full description link not present when content less than 50 words', async () => {
  render(
    <Description cont={loremIpsum49Words} maxLength={50} />
  )
  const paragraphContent = screen.queryByText(/See full description/i)
  expect(paragraphContent).not.toBeInTheDocument()
})

test('See/hide full description link not present when content less than maxLength', async () => {
  render(
    <Description cont={loremIpsum49Words} maxLength={49} />
  )
  const seeFullDescription = screen.queryByText(/See full description/i)
  const hideFullDescription = screen.queryByText(/Hide full description/i)
  expect(seeFullDescription).not.toBeInTheDocument()
  expect(hideFullDescription).not.toBeInTheDocument()
})
