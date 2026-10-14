import { parseMPDate } from '../utils'
import { format } from 'date-fns'

describe('parseMPDate regression tests for Mountain Project tick date import (Issue #1456)', () => {
  // All North American timezones where Mountain Project operates
  const usTimezones = [
    'America/New_York', // Eastern (UTC-4/UTC-5)
    'America/Chicago', // Central (UTC-5/UTC-6)
    'America/Denver', // Mountain (UTC-6/UTC-7)
    'America/Los_Angeles', // Pacific (UTC-7/UTC-8)
    'America/Anchorage', // Alaska (UTC-8/UTC-9)
    'Pacific/Honolulu' // Hawaii (UTC-10, no DST)
  ]

  describe('reported 1-day shift: reproduction and fix', () => {
    it('demonstrates that the old naive midnight-UTC parsing causes a 1-day shift in US timezones', () => {
      const originalDate = '2026-04-03'
      // Old buggy parsing: Date.parse(`${tick.Date}T00:00:00`) on a UTC server produced midnight UTC.
      const buggyDate = new Date(`${originalDate}T00:00:00.000Z`)

      for (const timeZone of usTimezones) {
        const formatted = buggyDate.toLocaleDateString('en-US', { timeZone })
        // All North American (negative UTC-offset) browsers shift midnight UTC to the previous evening,
        // so April 3 displays as April 2.
        expect(formatted).toBe('4/2/2026')
      }
    })

    it('parses "2026-04-03" to noon UTC and preserves the correct calendar date in all US timezones', () => {
      const parsed = parseMPDate('2026-04-03')

      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')

      for (const timeZone of usTimezones) {
        expect(parsed.toLocaleDateString('en-US', { timeZone })).toBe('4/3/2026')
      }
    })
  })

  describe('noon-UTC coverage: safe window is UTC-11 to UTC+11', () => {
    it('preserves the date in UTC-11 (Pacific/Pago_Pago – westernmost US coverage)', () => {
      const parsed = parseMPDate('2026-04-03')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
      // UTC-11: noon UTC = 1 AM local – still April 3
      expect(parsed.toLocaleDateString('en-US', { timeZone: 'Pacific/Pago_Pago' })).toBe('4/3/2026')
    })

    it('preserves the date in UTC+11 (Pacific/Efate – Vanuatu)', () => {
      const parsed = parseMPDate('2026-04-03')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
      // UTC+11: noon UTC = 11 PM local – still April 3
      expect(parsed.toLocaleDateString('en-US', { timeZone: 'Pacific/Efate' })).toBe('4/3/2026')
    })

    it('shifts to the next calendar day in UTC+12 and beyond (outside the safe window)', () => {
      const parsed = parseMPDate('2026-04-03')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
      // UTC+12: noon UTC = midnight local – crosses into April 4
      expect(parsed.toLocaleDateString('en-US', { timeZone: 'Pacific/Auckland' })).toBe('4/4/2026')
      // UTC+13 (Samoa): same effect
      expect(parsed.toLocaleDateString('en-US', { timeZone: 'Pacific/Apia' })).toBe('4/4/2026')
    })
  })

  describe('calendar boundary tests', () => {
    it('preserves the first day of a month (2026-05-01 does not shift to April 30)', () => {
      const parsed = parseMPDate('2026-05-01')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-05-01T12:00:00.000Z')

      for (const timeZone of usTimezones) {
        expect(parsed.toLocaleDateString('en-US', { timeZone })).toBe('5/1/2026')
      }
    })

    it('preserves the last day of a month (2026-04-30 does not shift to May 1)', () => {
      const parsed = parseMPDate('2026-04-30')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-30T12:00:00.000Z')

      for (const timeZone of usTimezones) {
        expect(parsed.toLocaleDateString('en-US', { timeZone })).toBe('4/30/2026')
      }
    })

    it('preserves January 1 (2024-01-01 does not shift to December 31 of the prior year)', () => {
      const parsed = parseMPDate('2024-01-01')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2024-01-01T12:00:00.000Z')

      for (const timeZone of usTimezones) {
        expect(parsed.toLocaleDateString('en-US', { timeZone })).toBe('1/1/2024')
      }
    })

    it('preserves December 31 (2023-12-31 does not shift to December 30)', () => {
      const parsed = parseMPDate('2023-12-31')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2023-12-31T12:00:00.000Z')

      for (const timeZone of usTimezones) {
        expect(parsed.toLocaleDateString('en-US', { timeZone })).toBe('12/31/2023')
      }
    })

    it('preserves leap day in a leap year (2024-02-29)', () => {
      const parsed = parseMPDate('2024-02-29')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2024-02-29T12:00:00.000Z')

      for (const timeZone of usTimezones) {
        expect(parsed.toLocaleDateString('en-US', { timeZone })).toBe('2/29/2024')
      }
    })
  })

  describe('invalid / impossible date rejection', () => {
    it('returns null for February 31 (impossible date)', () => {
      expect(parseMPDate('2026-02-31')).toBeNull()
    })

    it('returns null for February 30 (impossible date)', () => {
      expect(parseMPDate('2026-02-30')).toBeNull()
    })

    it('returns null for February 29 in a non-leap year', () => {
      expect(parseMPDate('2026-02-29')).toBeNull()
    })

    it('returns null for month 13', () => {
      expect(parseMPDate('2026-13-03')).toBeNull()
    })

    it('returns null for month 0', () => {
      expect(parseMPDate('2026-00-15')).toBeNull()
    })

    it('returns null for day 0', () => {
      expect(parseMPDate('2026-04-00')).toBeNull()
    })

    it('returns null for an empty string', () => {
      expect(parseMPDate('')).toBeNull()
    })

    it('returns null for a free-text timestamp string (not a recognised date-only format)', () => {
      expect(parseMPDate('2026-04-03T00:00:00.000Z')).toBeNull()
    })
  })

  describe('input format handling', () => {
    it('handles leading and trailing whitespace', () => {
      const parsed = parseMPDate('  2026-04-03  ')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
      expect(parsed.toLocaleDateString('en-US', { timeZone: 'America/Denver' })).toBe('4/3/2026')
    })

    it('handles single-digit month and day', () => {
      const parsed = parseMPDate('2026-4-3')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
      expect(parsed.toLocaleDateString('en-US', { timeZone: 'America/Denver' })).toBe('4/3/2026')
    })

    it('handles slash-delimited date strings (YYYY/MM/DD)', () => {
      const parsed = parseMPDate('2026/04/03')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
      expect(parsed.toLocaleDateString('en-US', { timeZone: 'America/Denver' })).toBe('4/3/2026')
    })
  })

  describe('UI display function compatibility', () => {
    it('formats the full date correctly with date-fns format() (as used in logbook Stats.tsx)', () => {
      const parsed = parseMPDate('2026-04-03')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
      // Stats.tsx uses: format(sortedList[0].dateClimbed, 'MMMM dd, yyyy')
      expect(format(parsed, 'MMMM dd, yyyy')).toBe('April 03, 2026')
    })

    it('formats correctly in all US timezones with toLocaleDateString()', () => {
      const parsed = parseMPDate('2026-04-03')
      expect(parsed).not.toBeNull()
      if (parsed == null) throw new Error('Expected parseMPDate to return a valid date')

      expect(parsed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
      for (const timeZone of usTimezones) {
        expect(parsed.toLocaleDateString('en-US', { timeZone })).toBe('4/3/2026')
      }
    })
  })
})
