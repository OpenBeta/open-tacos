import type { Processor } from 'unified'
import { gfmAutolinkLiteralFromMarkdown, gfmAutolinkLiteralToMarkdown } from 'mdast-util-gfm-autolink-literal'
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal'

interface MarkdownExtensionData {
  micromarkExtensions?: unknown[]
  fromMarkdownExtensions?: unknown[]
  toMarkdownExtensions?: unknown[]
}

/**
 * Autolink plain http(s) and www URLs. Leaves the rest of GitHub-flavoured
 * markdown (tables, task lists, strikethrough) off.
 */
export function remarkAutolinkLiteral (this: Processor): void {
  const data = this.data() as MarkdownExtensionData
  const micromarkExtensions = data.micromarkExtensions ?? (data.micromarkExtensions = [])
  const fromMarkdownExtensions = data.fromMarkdownExtensions ?? (data.fromMarkdownExtensions = [])
  const toMarkdownExtensions = data.toMarkdownExtensions ?? (data.toMarkdownExtensions = [])

  micromarkExtensions.push(gfmAutolinkLiteral())
  fromMarkdownExtensions.push(gfmAutolinkLiteralFromMarkdown())
  toMarkdownExtensions.push(gfmAutolinkLiteralToMarkdown())
}
