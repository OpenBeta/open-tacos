/**
 * Parses a Mountain Project date-only string (e.g. 'YYYY-MM-DD' or 'YYYY/MM/DD')
 * and returns a Date at noon UTC (12:00:00.000Z), or null if the input is not a
 * recognised calendar date.
 *
 * ## Why noon UTC?
 * Mountain Project's CSV `Date` column is a date-only value with no time or
 * timezone component.  The import route runs on the Next.js server whose runtime
 * timezone is UTC.  Storing the tick at midnight UTC (00:00:00Z) causes the date
 * to display one day earlier in any negative-UTC-offset browser (EDT UTC-4 through
 * HST UTC-10), because local midnight is 8-20 hours behind UTC midnight.
 *
 * Storing at noon UTC (12:00:00Z) provides a ±11-hour safe window, which covers
 * every US/Canada timezone (UTC-10 to UTC-4) and every timezone from UTC-11
 * through UTC+11.  Timezones beyond UTC+12 (e.g. New Zealand, Samoa) may still
 * see a +1 day shift; Mountain Project's user base is North American, so this
 * is an acceptable trade-off that avoids a far more complex server-to-client
 * timezone handshake.
 *
 * ## Why null on invalid dates?
 * Returning null instead of throwing lets the import loop skip rows with corrupt
 * date data (e.g. '2026-02-31', '2026-13-01') without aborting the entire import.
 * This matches the route's existing behaviour of silently dropping rows with an
 * unresolvable route URL.
 */
export function parseMPDate (dateStr: string): Date | null {
  const trimmed = (dateStr ?? '').trim()
  const match = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(trimmed)
  if (match != null) {
    const year = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const day = parseInt(match[3], 10)

    // Validate calendar ranges before constructing a Date.
    // ECMA-262 silently overflows out-of-range days (e.g. Feb 31 becomes Mar 3),
    // so we must check manually.
    if (month < 1 || month > 12) return null
    if (day < 1) return null
    // daysInMonth: day 0 of the *next* month == last day of the target month
    const dim = new Date(Date.UTC(year, month, 0)).getUTCDate()
    if (day > dim) return null

    const mm = String(month).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return new Date(`${year}-${mm}-${dd}T12:00:00.000Z`)
  }

  return null
}
