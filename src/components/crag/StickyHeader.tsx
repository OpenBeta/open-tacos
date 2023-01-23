import BreadCrumbs from '../ui/BreadCrumbs'

interface StickyBreadCrumbsProps {
  isClimbPage?: boolean
  ancestors: string[]
  pathTokens: string[]
  formAction: JSX.Element
}

/**
 * Sticky header containing breadcrumbs and save/reset button in edit mode
 */
export const StickyHeader = ({ isClimbPage = false, ancestors, pathTokens, formAction }: StickyBreadCrumbsProps): JSX.Element => {
  return (
    <div className='sticky top-0 z-40 py-2 lg:min-h-[4rem] block lg:flex lg:items-center lg:justify-between bg-base-100 -mx-4 px-4'>
      <BreadCrumbs isClimbPage={isClimbPage} ancestors={ancestors} pathTokens={pathTokens} />
      <div className='hidden lg:block'>
        {formAction}
      </div>
    </div>
  )
}
