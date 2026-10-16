import { parseMpTickDate } from '../date'

describe('parseMpTickDate', () => {
  it('anchors a Mountain Project calendar date to 12:00 UTC', () => {
    expect(parseMpTickDate('2024-04-03').toISOString()).toBe(
      '2024-04-03T12:00:00.000Z'
    )
  })

  // Regression for #1456: imported ticks showed up one day early because the
  // date was parsed as midnight and then formatted in a timezone behind UTC.
  it.each([
    ['America/Los_Angeles'], // UTC-8/-7
    ['America/New_York'], //    UTC-5/-4
    ['America/Sao_Paulo'], //   UTC-3
    ['UTC'], //                 UTC
    ['Europe/Berlin'], //       UTC+1/+2
    ['Asia/Kolkata'], //        UTC+5:30
    ['Asia/Tokyo'] //           UTC+9
  ])('keeps the calendar date 2024-04-03 when formatted in %s', (timeZone) => {
    const formatted = parseMpTickDate('2024-04-03').toLocaleDateString('en-CA', {
      timeZone
    })
    expect(formatted).toBe('2024-04-03')
  })

  it('does not shift the date backwards for the earliest realistic offset (UTC-11)', () => {
    const formatted = parseMpTickDate('2024-04-03').toLocaleDateString('en-CA', {
      timeZone: 'Pacific/Pago_Pago' // UTC-11
    })
    expect(formatted).toBe('2024-04-03')
  })

  it('handles single-digit months and days', () => {
    expect(parseMpTickDate('2023-01-05').toISOString()).toBe(
      '2023-01-05T12:00:00.000Z'
    )
  })
})
