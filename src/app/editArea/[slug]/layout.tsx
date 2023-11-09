import { SidebarNav } from './SidebarNav'

export default function RootLayout ({
  children, params
}: {
  children: React.ReactNode, params: { slug: string }
}): any {
  return (
    <div>
      <h1 className='px-12 text-4xl tracking-tight py-12 block'>Edit area</h1>
      <hr className='border-1' />
      <div className='pt-12 flex bg-base-200'>
        <SidebarNav slug={params.slug} />
        <main className='w-full px-16'>
          {children}
        </main>
      </div>
    </div>
  )
}
