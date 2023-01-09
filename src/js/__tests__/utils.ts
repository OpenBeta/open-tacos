import { checkUsername, checkWebsiteUrl } from '../utils'

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

export {}
