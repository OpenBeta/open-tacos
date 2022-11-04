import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Card from '../Card/Card'
import Image from 'next/legacy/image'

test('Card renders a header and a body', async () => {
  // Using a random image hosted on placeimg.com to render an image.
  const imageURL = 'https://placeimg.com/400/225/arch'

  render(
    <Card
      image={
        <Image
          src={imageURL}
          alt=''
          objectFit='cover'
          objectPosition='center'
          layout='fill'
        />
      }
      header='Some Header Content'
      body='Some Body Content'
    />
  )
  const header = screen.getByText(/Some Header Content/i)
  expect(header).toBeInTheDocument()

  const body = screen.getByText(/Some Body Content/i)
  expect(body).toBeInTheDocument()
})
