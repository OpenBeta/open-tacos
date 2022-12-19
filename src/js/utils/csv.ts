import { format, parseISO } from 'date-fns'
import { saveAs } from 'file-saver'

const SEPARATOR = '|'

/**
 * Fields to be exported
 */
const fields = ['email', 'created_at', 'last_login']

/**
 * Transform an array of Auth0 user objects to CSV string
 * @param users Auth0 user array
 * @returns csv
 */
export const usersToCsv = (users: undefined | any[]): string => {
  if (users == null) return ''
  return users?.map(processUser).join('\r\n')
}

const replacer = (key, value): string => value == null ? '' : value // specify how you want to handle null values here

/**
 * Extract selected fields from the user object
 * @param user Auth0 user
 * @returns csv
 */
const processUser = (user: any): string => {
  return fields.map(field => {
    let value = user[field]
    if (field === 'created_at' || field === 'last_login') {
      value = format(parseISO(user[field]), 'P')
    }
    return JSON.stringify(value, replacer) // calling JSON.strigify() to get value quoted
  }).join(SEPARATOR)
}

export const saveAsCSVFile = (data: any, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, filename)
}
