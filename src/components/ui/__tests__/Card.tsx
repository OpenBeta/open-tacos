import React from 'react'
import { render, screen } from '@testing-library/react'
import Card from '../Card/Card'
import Image from 'next/image'

test('Card renders a header and a body', async () => {
  // Must use an image hosted by whitelisted domains in next.config.js
  const imageURL = 'https://openbeta-dev.sirv.com/u/b9f8ab3b-e6e5-4467-9adb-65d91c7ebe7c/6wFDRfFJD9.jpeg'

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
