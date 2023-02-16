import { EditorState, LexicalEditor, $getRoot, TextNode } from 'lexical'
import { ControllerRenderProps, UseFormSetValue, FieldValues } from 'react-hook-form'
import { validate as isUuid, v4 as uuidV4 } from 'uuid'
import { indexBy, Dictionary } from 'underscore'

import { EditableClimbType } from '../crag/cragSummary'

export default function onChange (editorState: EditorState, editor: LexicalEditor, field: ControllerRenderProps): void {
  if (field?.onChange == null) return
  editorState.read(() => {
    const root = $getRoot()
    field?.onChange(root.getTextContent()?.trim())
  })
}

export function onChangeCsv (editorState: EditorState, editor: LexicalEditor, replace, fields: any, setValue: UseFormSetValue<FieldValues>): void {
  editorState.read(() => {
    const defaultClimbDict = indexBy<EditableClimbType[]>(fields, 'climbId')
    const root = $getRoot()
    const lines = root.getAllTextNodes().reduce((acc: EditableClimbType[], currentLine, index) => {
      const curr = parseLine(currentLine, index, defaultClimbDict)
      if (curr != null) {
        acc.push(curr)
      }
      return acc
    }
    , [])

    replace(lines)
  })
}

const parseLine = (line: TextNode, index: number, defaultClimbDict: Dictionary<EditableClimbType>): EditableClimbType | null => {
  const tokens = line.getTextContent()?.trim().split(/\s*\|\s*/)
  return csvToClimb(tokens, index, defaultClimbDict)
}

export const csvToClimb = (tokens: string[], index: number, defaultClimbDict: Dictionary<EditableClimbType>): EditableClimbType | null => {
  if (tokens.length >= 2) {
    const firstToken = tokens[0].trim()
    const climbIdValidFormat = isUuid(firstToken)

    const climbId = climbIdValidFormat ? firstToken : uuidV4()
    const name = tokens[1].trim()
    if (name === '') return null
    return {
      id: index.toString(),
      climbId,
      name,
      leftRightIndex: index,
      gradeStr: climbId != null && defaultClimbDict?.[climbId] != null ? defaultClimbDict?.[climbId].gradeStr : undefined,
      isNew: !climbIdValidFormat
    }
  }
  if (tokens.length === 1) {
    if (isUuid(tokens[0].trim())) {
      const climbId = tokens[0].trim()
      return {
        id: index.toString(),
        climbId,
        name: `Untitled ${index + 1}`,
        leftRightIndex: index,
        gradeStr: climbId != null && defaultClimbDict?.[climbId] != null ? defaultClimbDict?.[climbId].gradeStr : undefined
      }
    }
    const name = tokens[0].trim()
    if (name === '') return null
    return {
      id: index.toString(),
      climbId: uuidV4(),
      name,
      leftRightIndex: index,
      gradeStr: undefined,
      isNew: true
    }
  }
  return {
    id: index.toString(),
    climbId: uuidV4(),
    name: `Untitled ${index + 1}`,
    leftRightIndex: index,
    gradeStr: undefined,
    isNew: true
  }
}
