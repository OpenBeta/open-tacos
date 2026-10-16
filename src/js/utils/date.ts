/**
 * Convert a Mountain Project tick date into a `Date`.
 *
 * Mountain Project's tick export supplies a calendar date (`YYYY-MM-DD`) with
 * no time or timezone component. Parsing it as midnight (either local or UTC)
 * produces an instant that falls on the *previous* calendar day once it is
 * formatted in a timezone behind UTC, which is why imported ticks showed up a
 * day early (see issue #1456).
 *
 * Anchoring the date to 12:00 UTC keeps it on the same calendar day when it is
 * rendered in any timezone from UTC-12 through UTC+11, which covers every
 * inhabited timezone, so the imported date matches the date shown on Mountain
 * Project regardless of the server's or the viewer's timezone.
 *
 * @param dateClimbed - A calendar date string, e.g. `"2024-04-03"`.
 * @returns A `Date` anchored to 12:00 UTC on that calendar day.
 */
export function parseMpTickDate (dateClimbed: string): Date {
  return new Date(`${dateClimbed}T12:00:00.000Z`)
}
