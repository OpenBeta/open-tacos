const checkAndPrintWarning = (name: string, value: string): string => {
  if (value === undefined || value === '') {
    console.error(`## Error: '${name}' not defined ##`)
    if (window === undefined) process?.exit(1)
  }
  return value
}

export const NEXT_PUBLIC_MAPBOX_API_KEY = checkAndPrintWarning(
  'NEXT_PUBLIC_MAPBOX_API_KEY', process.env.NEXT_PUBLIC_MAPBOX_API_KEY)
