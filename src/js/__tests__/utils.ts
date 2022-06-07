import { checkUsername } from '../utils'

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

export {}
