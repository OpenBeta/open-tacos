interface IconProps {
  type: string
  width?: number
  height?: number
  className?: string
}

const Icon = ({ width = 20, height = 20, type, className }: IconProps): JSX.Element => {
  const path = icons[type]
  return (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' stroke='currentColor' fill='currentColor'>
      <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d={path} />
    </svg>
  )
}

const icons = {
  droppin: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  pencil: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
}
export default Icon
