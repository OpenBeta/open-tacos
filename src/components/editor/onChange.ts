import { EditorState, LexicalEditor, $getRoot, TextNode } from 'lexical'
import { ControllerRenderProps } from 'react-hook-form'
import { validate as isUuid } from 'uuid'

export default function onChange (editorState: EditorState, editor: LexicalEditor, field: ControllerRenderProps): void {
  if (field?.onChange == null) return
  editorState.read(() => {
    const root = $getRoot()
    console.log('#root', root.getAllTextNodes())
    field?.onChange(root.getTextContent()?.trim())
  })
}

export function onChangeCsv (editorState: EditorState, editor: LexicalEditor, field: ControllerRenderProps): void {
  if (field?.onChange == null) return
  editorState.read(() => {
    const root = $getRoot()
    // console.log('#root', root.getAllTextNodes())
    const lines = root.getAllTextNodes().map(parseLine)
    console.log('#lines', lines)
    field?.onChange(lines)
  })
}

const parseLine = (line: TextNode, index: number): any => {
  const tokens = line.getTextContent()?.trim().split(/\s*\|\s*/)
  return csvToClimb(tokens, index)
  // return tokens.map(csvToClimb)
}

// type TransformerType = (rawCsv: string) => ClimbType[]

export const csvToClimb = (tokens: string[], index: number): any => {
  if (tokens.length === 2) {
    const id = isUuid(tokens[0].trim()) ? tokens[0].trim() : null
    const name = tokens[1].trim()
    return {
      id,
      name
    }
  }
  if (tokens.length === 1) {
    if (isUuid(tokens[0].trim())) {
      return {
        id: tokens[0].trim(),
        name: `Untitled ${index}`
      }
    }
    return {
      id: null,
      name: tokens[0].trim()
    }
  }
  return {
    id: null,
    name: `Untitled ${index}`
  }
}
