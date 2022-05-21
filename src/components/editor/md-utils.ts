import { unified } from 'unified'
import markdown from 'remark-parse'
import slate, { defaultNodeTypes, serialize } from '@openbeta/remark-slate'
import yaml from 'js-yaml'

import { simplifyClimbTypeJson } from '../../js/utils'

const DEFAULT_HEADINGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6'
}

const DESERIALIZE_OPTS = {
  nodeTypes: {
    ...defaultNodeTypes,
    paragraph: 'p',
    heading: { ...DEFAULT_HEADINGS },
    link: 'a',
    image: 'img'
  },
  linkDestinationKey: 'url',
  imageSourceKey: 'url'
}

const SERIALIZE_OPTS = {
  nodeTypes: {
    ...defaultNodeTypes,
    paragraph: 'p',
    link: 'a',
    image: 'img',
    heading: { ...DEFAULT_HEADINGS }
  }
}

/**
 * Convert markdown string to Slate AST
 * @param markdown markdown string
 */
export const mdToSlate = (mdStr: string): any => {
  if (mdStr === null) {
    return null
  }
  const processor = unified().use(markdown).use(slate, DESERIALIZE_OPTS)
  return topImages(processor.processSync(mdStr).result)
}

/**
 * Convert Slate AST to markdown string
 * @param  ast
 */
export const slateToMarkdown = (ast: any[]): string => {
  return ast !== null ? ast.map((v) => serialize(v, SERIALIZE_OPTS)).join('\n') : ''
}

/**
 * Move image nodes to top-level
 * @param  {Object} ast Slate AST
 */
export const topImages = (ast): any => {
  return ast.reduce((acc, cur) => {
    const processedNode = cur
    // Extract images from wrapping node while preserving any other children
    if (processedNode.children !== null && processedNode.type === 'p') {
      const images: any[] = []
      const children: any = []
      processedNode.children.forEach((node) => {
        if (node.type === 'img') {
          images.push(node)
        } else {
          children.push(node)
        }
      })
      if (children.length > 0) {
        return acc.concat({ ...processedNode, children }, images)
      } else {
        return acc.concat(images)
      }
    } else {
      return acc.concat(processedNode)
    }
  }, [])
}

/**
 * Stringify frontmatter object and content AST to complete markdown string for sending over the wire.
 * @param {Object} data Data object
 * @param {Object} Data.frontmatter frontmatter object from Formik
 * @param {Object} Data.body_ast Content AST from Slate editor
 * @returns {string} markdown string
 */
export const stringify = ({ frontmatter, bodyAst }): string => {
  if (frontmatter.type !== null) {
    frontmatter.type = simplifyClimbTypeJson(frontmatter.type)
  }
  /* eslint-disable-next-line */
  return `---\n ${yaml.dump(frontmatter)} \n---\n${slateToMarkdown(bodyAst)}`
}
