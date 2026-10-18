import { ClimbDisciplineRecord } from '../types'
import { checkUsername, checkWebsiteUrl, removeTypenameFromDisciplines, sanitizeName } from '../utils'

it('Valid usernames', () => {
  expect(checkUsername('cool-user')).toBeTruthy()
  expect(checkUsername('u_name-123')).toBeTruthy()
  expect(checkUsername('u1234567890123456789')).toBeTruthy()
})

it('Invalid usernames', () => {
  expect(!checkUsername('contains!_speci/al_chars')).toBeTruthy()
  expect(!checkUsername('contains[char]s')).toBeTruthy()
  expect(!checkUsername('w#a$a%a^a&a*a(a)a?')).toBeTruthy()
  expect(!checkUsername('_begins_with_a_symbol')).toBeTruthy()
  expect(!checkUsername('ends_with_a_symbol_')).toBeTruthy()
  expect(!checkUsername('two-consecutive--symbols')).toBeTruthy()
  expect(!checkUsername('contains_oPenbeta')).toBeTruthy()
  expect(!checkUsername('contains_ADMIN')).toBeTruthy()
})

it('Valid URLS', () => {
  expect(checkWebsiteUrl('https://example.com/')).toEqual('https://example.com/')
  expect(checkWebsiteUrl('https:www.example.com')).toEqual('https://www.example.com/')
  // Add a trailing slash
  expect(checkWebsiteUrl('https://yeb.dev')).toEqual('https://yeb.dev/')
  expect(checkWebsiteUrl('https://www.instagram.com/handle.jpg/')).toEqual('https://www.instagram.com/handle.jpg/')

  // Trailing slash + https://
  expect(checkWebsiteUrl('www.example.com')).toEqual('https://www.example.com/')
  expect(checkWebsiteUrl('example.com')).toEqual('https://example.com/')
})

it('Invalid ULS', () => {
  // No arbitrary protocols
  expect(checkWebsiteUrl('htttps://example.com/')).toBeNull()
  // TLS is required
  expect(checkWebsiteUrl('http://example.com/')).toBeNull()

  expect(checkWebsiteUrl('')).toBeNull()
  expect(checkWebsiteUrl(undefined as any)).toBeNull()
  expect(checkWebsiteUrl(null as any)).toBeNull()
})

it('removes __typename from disciplines obj', () => {
  const disciplines: ClimbDisciplineRecord = {
    sport: true,
    trad: false,
    aid: false,
    bouldering: false,
    mixed: false,
    ice: false,
    alpine: false,
    snow: false,
    tr: false
  }
  // @ts-expect-error
  disciplines.__typename = 'ClimbDiscipline'
  expect(removeTypenameFromDisciplines(disciplines)).toEqual({
    sport: true
  })
})


describe('sanitizeName', () => {
  it('strips leading parenthetical index markers and removes trailing spaces', () => {
    expect(sanitizeName('(6) North Face')).toEqual('North Face')
    expect(sanitizeName('(6)   North Face')).toEqual('North Face')
    expect(sanitizeName('(aa) South Face')).toEqual('South Face')
    expect(sanitizeName('(12) East Ridge')).toEqual('East Ridge')
  })

  it('strips leading numeric colon markers without leaving leading whitespace', () => {
    expect(sanitizeName('1: The Great Roof')).toEqual('The Great Roof')
    expect(sanitizeName('12: The Arête')).toEqual('The Arête')
    expect(sanitizeName('10: Direct')).toEqual('Direct')
  })

  it('strips leading list letter prefixes with period and whitespace', () => {
    expect(sanitizeName('a. Direct Finish')).toEqual('Direct Finish')
    expect(sanitizeName('b. Crack Climb')).toEqual('Crack Climb')
    expect(sanitizeName('aa. Left Variation')).toEqual('Left Variation')
    expect(sanitizeName('A. First Ascent Route')).toEqual('First Ascent Route')
    expect(sanitizeName('B. Alternate Start')).toEqual('Alternate Start')
  })

  it('preserves location abbreviations and mid-string colons or abbreviations', () => {
    expect(sanitizeName('Mt. Rainier')).toEqual('Mt. Rainier')
    expect(sanitizeName('Mount St. Helens')).toEqual('Mount St. Helens')
    expect(sanitizeName('St. George')).toEqual('St. George')
    expect(sanitizeName('Ft. Collins')).toEqual('Ft. Collins')
    expect(sanitizeName('Pt. Reyes')).toEqual('Pt. Reyes')
    expect(sanitizeName('Route 12:00')).toEqual('Route 12:00')
    expect(sanitizeName('Climb at 3:30')).toEqual('Climb at 3:30')
    expect(sanitizeName('Boulder 1: The First')).toEqual('Boulder 1: The First')
    expect(sanitizeName('1-6-9 Boulder')).toEqual('1-6-9 Boulder')
    expect(sanitizeName('A.K.A. The Beast')).toEqual('A.K.A. The Beast')
    expect(sanitizeName('Normal Route')).toEqual('Normal Route')
  })

  it('handles empty or nullish strings safely', () => {
    expect(sanitizeName('')).toEqual('')
    expect(sanitizeName(null as unknown as string)).toEqual('')
    expect(sanitizeName(undefined as unknown as string)).toEqual('')
  })
})

export {}

