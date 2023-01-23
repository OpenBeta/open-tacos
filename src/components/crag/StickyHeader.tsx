import BreadCrumbs from '../ui/BreadCrumbs'
import { FormSaveAction } from '../../components/editor/FormSaveAction'

interface StickyBreadCrumbsProps {
  isClimbPage?: boolean
  ancestors: string[]
  pathTokens: string[]
  cache: any
  editMode: boolean
  onReset: () => void
}

export const StickyHeader = ({ isClimbPage = false, ancestors, pathTokens, cache, editMode, onReset }: StickyBreadCrumbsProps): JSX.Element => {
  return (
    <div className='sticky top-0 z-40 py-2 lg:min-h-[4rem] block lg:flex lg:items-center lg:justify-between bg-base-100 -mx-4 px-4'>
      <BreadCrumbs isClimbPage={isClimbPage} ancestors={ancestors} pathTokens={pathTokens} />
      <div className='hidden lg:block'>
        <FormSaveAction
          cache={cache}
          editMode={editMode}
          onReset={onReset}
        />
      </div>
    </div>
  )
}
