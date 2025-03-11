'use client'

interface SidebarNavProps {

}

/**
 * Sidebar navigation for area edit
 */
export const SidebarNav: React.FC<SidebarNavProps> = () => {
  return (
    <nav className='px-6'>
      <div className='sticky top-16'>
        <ul className='menu w-56 px-0' />
        Side bar
      </div>
    </nav>
  )
}
