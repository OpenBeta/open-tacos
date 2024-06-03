import React, { ReactNode } from 'react'

import { Hero } from './components/Hero'
import { About } from './components/About'

export default function AboutPage (): ReactNode {
  return (
    <article>
      <Hero />
      <About />
    </article>
  )
}
