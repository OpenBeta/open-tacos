import type { ComponentPropsWithoutRef } from 'react'
import Markdown from 'react-markdown'
import { remarkAutolinkLiteral } from './remarkAutolinkLiteral'

interface WikiMarkdownProps {
  children?: string | null
}

/**
 * Off-site links open in a new tab. Links back to OpenBeta stay on this tab.
 */
const opensInNewTab = (href: string | undefined): boolean => {
  if (href == null || href === '') return false
  try {
    const url = new URL(href, 'https://openbeta.io')
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    const host = url.hostname.replace(/^www\./, '')
    return host !== 'openbeta.io' && !host.endsWith('.openbeta.io')
  } catch {
    return false
  }
}

const WikiLink = ({ href, children }: ComponentPropsWithoutRef<'a'>): JSX.Element => {
  const external = opensInNewTab(href)
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

/**
 * Climb and area prose. Plain http(s) and www URLs become links.
 * Markdown links are unchanged.
 */
export const WikiMarkdown: React.FC<WikiMarkdownProps> = ({ children }) => {
  return (
    <Markdown
      className='wiki-content'
      remarkPlugins={[remarkAutolinkLiteral]}
      components={{ a: WikiLink }}
    >
      {children ?? ''}
    </Markdown>
  )
}
