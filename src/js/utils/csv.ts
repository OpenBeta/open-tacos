import { format, parseISO } from 'date-fns'
import { saveAs } from 'file-saver'
import { OrganizationType } from '../types'

const SEPARATOR = '|'

/**
 * Fields to be exported
 */
const userFields = ['email', 'created_at', 'last_login']
const orgFields = ['orgId', 'orgType', 'displayName', 'associatedAreaIds', 'excludedAreaIds', 'website', 'instagramLink', 'description', 'donationLink', 'email', 'createdAt', 'updatedAt']

/**
 * Transform an array of organization objects to CSV string
 * @param orgs org array
 * @returns csv
 */
export const orgsToCsv = (orgs: undefined | OrganizationType[]): string => {
  if (orgs == null) return ''
  return orgs?.map(processOrg).join('\r\n')
}

/**
 * Extract selected fields from the organization object
 * @param org Organization
 * @returns csv
 */
const processOrg = (org: OrganizationType): string => {
  return orgFields.map(field => {
    let value = org?.[field] ?? '';
    if ((field === 'createdAt' || field === 'updatedAt') && org[field] !== undefined) {
      value = format(new Date(org[field] as number), 'P')
    }
    if (['website', 'donationLink', 'instagramLink', 'email', 'description'].includes(field)) {
      value = org.content?.[field] ?? ''
    }
    return JSON.stringify(value, replacer) // calling JSON.stringify() to get value quoted
  }).join(SEPARATOR)
}

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
  return userFields.map(field => {
    let value = user?.[field] ?? ''
    if (value !== '' && (field === 'created_at' || field === 'last_login')) {
      value = format(parseISO(user[field]), 'P')
    }
    return JSON.stringify(value, replacer) // calling JSON.stringify() to get value quoted
  }).join(SEPARATOR)
}

export const saveAsCSVFile = (data: any, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, filename)
}
