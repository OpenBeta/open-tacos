import { COLOR_PALETTE_1 } from '../../colors'

export function getSingleAreaIcon (): string {
  return (
    `<svg width='42' height='42' xmlns='http://www.w3.org/2000/svg'>
      <circle cx="20" cy="20" r="20" fill='black'/>
    </svg>`
  )
}

type Color = string
type Angle = number
type PieData = Array<[Color, Angle]>

export function getTypePieData (aggregatedTypes: Array<[string, number]>): PieData {
  const pieSlices: Record<Color, Angle> = {}
  const total = getTotal(aggregatedTypes)

  for (let i = 0; i < aggregatedTypes.length; i++) {
    const [label, count]: [string, number] = aggregatedTypes[i]
    const angle = (count / total) * 2 * Math.PI
    const color = getColorForTypes(label)
    const totalAngle: Angle = pieSlices[color] !== undefined ? pieSlices[color] : 0
    pieSlices[color] = totalAngle + angle
  }

  const slices = Object.entries(pieSlices)
  return slices.sort((a, b) => { return b[1] - a[1] })
}

export function getTotal (aggregatedTypes: Array<[string, number]>): number {
  return aggregatedTypes.reduce((sum: number, [_, count]: [string, number]) => {
    sum += count
    return sum
  }, 0)
}

export function getPieIcon ({ data, text }: { data: PieData, text: string }): string {
  const padding = 20
  const radius = 55
  const center = [radius + padding, radius + padding]
  const paths: string[] = []

  let start = [(radius * 2) + padding, radius + padding] // + < right middle
  let angle = 0
  const size = padding * 2 + radius * 2

  for (let i = 0; i < data.length; i++) {
    const [color, part]: [Color, number] = data[i] as [string, number]
    angle += part

    const endPoint = [
      center[0] + (radius * Math.cos(angle)),
      center[1] + (radius * Math.sin(angle))
    ]

    const largeArcSweep = part > Math.PI ? '1' : '0'
    if (part >= Math.PI * 2) {
      // arcs dont' do full circles well, so just swap in a circle
      paths.push(`<circle cx="${center[0]}" cy="${center[1]}" r="${radius}" stroke="${color}" fill="transparent" stroke-width="${padding}"/>`)
    } else {
      paths.push(`<path d='M${start[0]}, ${start[1]} A ${radius} ${radius} 0 ${largeArcSweep} 1 ${endPoint[0]} ${endPoint[1]}' stroke="${color}" fill="transparent" stroke-width="${padding}"/>`)
    }

    start = endPoint
  }

  return (
    `<svg width='${size}' height='${size}' xmlns='http://www.w3.org/2000/svg'>
     <style>
      .small { font: italic 12px sans-serif; }
      .heavy { font: bold 30px sans-serif; fill: black; }
    </style>
    <g transform="rotate(-90, ${size / 2},${size / 2})"> ${paths.join('')}</g>
     <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="heavy">
      ${text}
     </text>
    </svg>`
  )
}

function getColorForTypes (label: string): string {
  const pallete = COLOR_PALETTE_1
  switch (label) {
    case 'trad':
      return pallete[0]
    case 'tr':
    case 'sport':
      return pallete[1]
    case 'aid':
      return pallete[2]
    case 'boulder':
      return pallete[3]
    case 'alpine':
    case 'snow':
    case 'mixed':
    case 'ice':
      return pallete[4]
    default:
      console.warn(`Label: ${label} doesn't have a color`)
      return pallete[5]
  }
}
