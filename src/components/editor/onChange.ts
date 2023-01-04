import { EditorState, LexicalEditor, $getRoot, TextNode } from 'lexical'
import { ControllerRenderProps, UseFormSetValue, FieldValues } from 'react-hook-form'
import { validate as isUuid } from 'uuid'
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
  // if (replace == null) return
  editorState.read(() => {
    const defaultClimbDict = indexBy<EditableClimbType[]>(fields, 'climbId')
    const root = $getRoot()
    const lines = root.getAllTextNodes().map((line, index) => parseLine(line, index, defaultClimbDict))

    replace(lines)
    // const defaultClimbDict = indexBy<EditableClimbType[]>(fields, 'climbId')

    // root.getAllTextNodes().forEach((textNode: TextNode, index: number) => {
    //   const activeClimbObj = parseLine(textNode, index)
    //   const { climbId, name, leftRightIndex } = activeClimbObj
    //   if (climbId == null) {
    //     setValue(`climbList.${index}`, activeClimbObj, { shouldValidate: true })
    //     return
    //   }
    //   const cachedClimb = defaultClimbDict[climbId]
    //   if (cachedClimb != null) {
    //     const { name: cachedName, leftRightIndex: cachedLeftRightIndex } = cachedClimb
    //     if (cachedName !== name) {
    //       setValue(`climbList.${index}.name`, name, { shouldValidate: true })
    //     }
    //     if (cachedLeftRightIndex !== leftRightIndex) {
    //       setValue(`climbList.${index}.leftRightIndex`, leftRightIndex, { shouldValidate: true })
    //     }
    //   }
    // })
    // console.log('#efault', fields)
  })
}

const parseLine = (line: TextNode, index: number, defaultClimbDict: Dictionary<EditableClimbType>): EditableClimbType => {
  const tokens = line.getTextContent()?.trim().split(/\s*\|\s*/)
  return csvToClimb(tokens, index, defaultClimbDict)
}

export const csvToClimb = (tokens: string[], index: number, defaultClimbDict): any => {
  if (tokens.length >= 2) {
    const climbId = isUuid(tokens[0].trim()) ? tokens[0].trim() : null
    const name = tokens[1].trim()

    //   if (cachedClimb != null) {
    return {
      id: climbId == null ? index : climbId,
      climbId,
      name: name === '' ? `Untitled ${index + 1}` : name,
      leftRightIndex: index,
      yds: climbId != null && defaultClimbDict?.[climbId] != null ? defaultClimbDict?.[climbId].yds : ''
    }
  }
  if (tokens.length === 1) {
    if (isUuid(tokens[0].trim())) {
      const climbId = tokens[0].trim()
      return {
        id: climbId == null ? index : climbId,
        climbId,
        name: `Untitled ${index + 1}`,
        leftRightIndex: index,
        yds: climbId != null && defaultClimbDict?.[climbId] != null ? defaultClimbDict?.[climbId].yds : ''
      }
    }
    return {
      id: index,
      climbId: null,
      name: tokens[0].trim(),
      leftRightIndex: index,
      yds: ''
    }
  }
  return {
    id: index,
    climbId: null,
    name: `Untitled ${index + 1}`,
    leftRightIndex: index,
    yds: ''
  }
}
