import Link from 'next/link'

export function GalleryContent ({ id, source }: { id: string, source: string }): JSX.Element {
  // This component is a placeholder for the gallery content

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-4'>Gallery</h1>
      <p className='mb-4'>Gallery ID: <code className='bg-gray-100 px-2 py-1 rounded'>{id}</code></p>
      <p className='mb-4'>Source: <code className='bg-gray-100 px-2 py-1 rounded'>{source}</code></p>

      <div className='mt-8 p-8 bg-gray-100 rounded-lg'>
        <div className='text-center text-gray-500'>Gallery content here</div>
      </div>
    </div>
  )
}

export function Gallery (): JSX.Element {
  // This component is a placeholder for the gallery list

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Gallery</h1>
      <ul className='space-y-2'>
        <li>
          <Link href='/gallery/12345' className='text-blue-500 hover:underline'>
            Gallery Item #12345
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Gallery
