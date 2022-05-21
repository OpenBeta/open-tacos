const checkAndPrintWarning = (name: string, value?: string): string => {
  if (value == null) {
    throw new Error(`## Error: '${name}' not defined ##`)
  }
  return value
}

export const NEXT_PUBLIC_MAPBOX_API_KEY = checkAndPrintWarning(
  'NEXT_PUBLIC_MAPBOX_API_KEY', process.env.NEXT_PUBLIC_MAPBOX_API_KEY)
