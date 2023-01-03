import { EditorState, LexicalEditor, $getRoot, TextNode } from 'lexical'
import { ControllerRenderProps } from 'react-hook-form'
import { validate as isUuid, v4 } from 'uuid'

export default function onChange (editorState: EditorState, editor: LexicalEditor, field: ControllerRenderProps): void {
  if (field?.onChange == null) return
  editorState.read(() => {
    const root = $getRoot()
    field?.onChange(root.getTextContent()?.trim())
  })
}

export function onChangeCsv (editorState: EditorState, editor: LexicalEditor, replace: any): void {
  if (replace == null) return
  editorState.read(() => {
    const root = $getRoot()
    const lines = root.getAllTextNodes().map(parseLine)
    replace(lines)
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
    const climbId = isUuid(tokens[0].trim()) ? tokens[0].trim() : null
    const name = tokens[1].trim()
    return {
      id: climbId == null ? index : climbId,
      climbId,
      name
    }
  }
  if (tokens.length === 1) {
    if (isUuid(tokens[0].trim())) {
      const climbId = tokens[0].trim()
      return {
        id: climbId == null ? index : climbId,
        climbId,
        name: `Untitled ${index}`
      }
    }
    return {
      id: index,
      climbId: null,
      name: tokens[0].trim()
    }
  }
  return {
    id: index,
    climbId: null,
    name: `Untitled ${index}`
  }
}
