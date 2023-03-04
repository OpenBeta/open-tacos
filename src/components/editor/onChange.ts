import { EditorState, LexicalEditor, $getRoot, TextNode } from 'lexical'
import { ControllerRenderProps, FieldValues, UseFieldArrayReplace, UseFormSetError } from 'react-hook-form'
import { validate as isUuid, v4 as uuidV4 } from 'uuid'
import { indexBy, Dictionary } from 'underscore'

import { EditableClimbType } from '../crag/cragSummary'
import { codesToDisciplines, defaultDisciplines } from '../../js/grades/util'
import type { GradeHelper } from '../../js/grades/Grade'

export default function onChange (editorState: EditorState, editor: LexicalEditor, field: ControllerRenderProps): void {
  if (field?.onChange == null) return
  editorState.read(() => {
    const root = $getRoot()
    field?.onChange(root.getTextContent()?.trim())
  })
}

export function onChangeCsv (
  editorState: EditorState,
  editor: LexicalEditor,
  replace: UseFieldArrayReplace<FieldValues, string>,
  fields: any[],
  gradeHelper: GradeHelper, setError, clearErrors): void {
  editorState.read(() => {
    const defaultClimbDict = indexBy<EditableClimbType[]>(fields, 'climbId')
    const root = $getRoot()
    const lines = root.getAllTextNodes().reduce((acc: EditableClimbType[], currentLine, index) => {
      const curr = parseLine(currentLine, index, defaultClimbDict, gradeHelper, setError, clearErrors)
      if (curr != null) {
        acc.push(curr)
      }
      return acc
    }
    , [])

    replace(lines)
  })
}

const parseLine = (line: TextNode, index: number, defaultClimbDict: Dictionary<EditableClimbType>, gradeHelper: GradeHelper, setError: UseFormSetError<FieldValues>, clearErrors): EditableClimbType | null => {
  const tokens = line.getTextContent()?.trim().split(/\s*\|\s*/)
  return csvToClimb(tokens, index, defaultClimbDict, gradeHelper, setError, clearErrors)
}

export const csvToClimb = (tokens: string[], index: number, defaultClimbDict: Dictionary<EditableClimbType>, gradeHelper: GradeHelper, setError: UseFormSetError<FieldValues>, clearErrors): EditableClimbType | null => {
  if (tokens.length >= 2) {
    const firstToken = tokens[0].trim()
    const climbIdValidFormat = isUuid(firstToken)

    const climbId = climbIdValidFormat ? firstToken : uuidV4()
    const name = tokens[1].trim()
    if (name === '') return null

    const gradeStr = tokens[2] ?? 'foos'
    const error = gradeHelper.validate(gradeStr)

    const disciplines = codesToDisciplines(tokens[3] ?? '')
    if (error == null) {
      clearErrors(`climbList.${index}`)
    } else {
      setError(`climbList.${index}`, { type: 'custom', message: error })
    }

    return {
      id: index.toString(),
      climbId,
      name,
      leftRightIndex: index,
      gradeStr,
      isNew: !climbIdValidFormat,
      error,
      disciplines
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
        gradeStr: climbId != null && defaultClimbDict?.[climbId] != null ? defaultClimbDict?.[climbId].gradeStr : undefined,
        disciplines: defaultClimbDict?.[climbId] != null ? defaultClimbDict[climbId].disciplines : defaultDisciplines()
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
      isNew: true,
      disciplines: defaultDisciplines()

    }
  }
  return {
    id: index.toString(),
    climbId: uuidV4(),
    name: `Untitled ${index + 1}`,
    leftRightIndex: index,
    gradeStr: undefined,
    isNew: true,
    disciplines: defaultDisciplines()
  }
}
