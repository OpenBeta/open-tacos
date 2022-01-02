import { getScoreForGrade } from '../utils'

describe('utils', () => {
  let consoleWarnMock
  beforeAll(() => {
    consoleWarnMock = jest.spyOn(global.console, 'warn').mockImplementation()
  })
  afterAll(() => {
    consoleWarnMock.mockRestore()
  })
  it('Converts 5.11a yds to score 112', () => {
    expect(getScoreForGrade('5.11a')).toBe(112)
  })
  it('Converts 5.9+ yds to score 91', () => {
    expect(getScoreForGrade('5.9+')).toBe(91)
  })
  it('Converts 5.9- yds to score 89', () => {
    expect(getScoreForGrade('5.9-')).toBe(89)
  })
  it('Converts 5.14a/b yds to score 143', () => {
    expect(getScoreForGrade('5.14a/b ')).toBe(143)
  })
  it('Converts 5.14d yds to score 148', () => {
    expect(getScoreForGrade('5.14d ')).toBe(148)
  })
  it('Converts 5.0 yds to score 0', () => {
    expect(getScoreForGrade('5.0 ')).toBe(0)
  })

  it('Converts 5.a yds to score 0', () => {
    const grade = getScoreForGrade('5.a ')
    expect(global.console.warn).toBeCalled()
    expect(grade).toBe(0)
  })

  // V Grades
  it('Converts V0 yds to score 1010', () => {
    expect(getScoreForGrade('V0')).toBe(1010)
  })
  it('Converts V1+ yds to score 1021', () => {
    expect(getScoreForGrade('V1+')).toBe(1021)
  })
  it('Converts V1-2 yds to score 1021', () => {
    expect(getScoreForGrade('V1-2')).toBe(1021)
  })
  it('Converts V16- yds to score 148', () => {
    expect(getScoreForGrade('V16- ')).toBe(1169)
  })
})
