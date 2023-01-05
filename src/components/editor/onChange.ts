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

export const csvToClimb = (tokens: string[], index: number, defaultClimbDict): any => {
  if (tokens.length >= 2) {
    const firstToken = tokens[0].trim()
    const climbIdValidFormat = isUuid(firstToken)

    const climbId = climbIdValidFormat ? firstToken : uuidV4()
    const name = tokens[1].trim()
    if (name === '') return null
    return {
      id: index,
      climbId,
      name,
      leftRightIndex: index,
      yds: climbId != null && defaultClimbDict?.[climbId] != null ? defaultClimbDict?.[climbId].yds : '',
      isNew: !climbIdValidFormat
    }
  }
  if (tokens.length === 1) {
    if (isUuid(tokens[0].trim())) {
      const climbId = tokens[0].trim()
      return {
        id: index,
        climbId,
        name: `Untitled ${index + 1}`,
        leftRightIndex: index,
        yds: climbId != null && defaultClimbDict?.[climbId] != null ? defaultClimbDict?.[climbId].yds : ''
      }
    }
    const name = tokens[0].trim()
    if (name === '') return null
    return {
      id: index,
      climbId: uuidV4(),
      name,
      leftRightIndex: index,
      yds: '',
      isNew: true
    }
  }
  return {
    id: index,
    climbId: uuidV4(),
    name: `Untitled ${index + 1}`,
    leftRightIndex: index,
    yds: '',
    isNew: true
  }
}
