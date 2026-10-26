import { TickSchema } from '../TickForm'

jest.mock('../../../js/graphql/Client', () => ({
  graphqlClient: {}
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' })
}))

describe('TickSchema validation', () => {
  const baseTick = {
    name: 'Midnight Lightning',
    climbId: 'climb-123',
    userId: 'user-456',
    notes: 'Classic boulder problem',
    grade: 'V8'
  }

  it('validates a tick with a valid past date', async () => {
    const tick = {
      ...baseTick,
      dateClimbed: new Date('2023-05-15')
    }
    await expect(TickSchema.validate(tick)).resolves.toMatchObject({
      name: 'Midnight Lightning',
      dateClimbed: new Date('2023-05-15')
    })
  })

  it('validates a tick without a date (null or undefined)', async () => {
    const tickWithoutDate = {
      ...baseTick,
      dateClimbed: null
    }
    await expect(TickSchema.validate(tickWithoutDate)).resolves.toMatchObject({
      name: 'Midnight Lightning',
      dateClimbed: null
    })
  })

  it('transforms empty string date into null and passes validation', async () => {
    const tickWithEmptyDate = {
      ...baseTick,
      dateClimbed: ''
    }
    await expect(TickSchema.validate(tickWithEmptyDate)).resolves.toMatchObject({
      name: 'Midnight Lightning',
      dateClimbed: null
    })
  })

  it('rejects a date in the future', async () => {
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const tickWithFutureDate = {
      ...baseTick,
      dateClimbed: futureDate
    }
    await expect(TickSchema.validate(tickWithFutureDate)).rejects.toThrow(/Please include a date in the past/i)
  })
})
