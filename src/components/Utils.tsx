import { ReactNode } from 'react'

interface AtagWrapperProps {
  href: string | null
  children: ReactNode
  className?: string
}
/**
 * Conditionally wrap a component with an html 'a' tag.
 */
export const ATagWrapper: React.FC<AtagWrapperProps> = ({ href, children, className }) => {
  return href == null
    ? (<>{children}</>)
    : (<a href={href} className={className}>{children}</a>)
}
