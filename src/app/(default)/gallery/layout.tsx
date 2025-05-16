import React from 'react'

export default function GalleryLayout ({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}): JSX.Element {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
