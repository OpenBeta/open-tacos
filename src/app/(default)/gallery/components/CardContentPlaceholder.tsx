import ContentLoader from 'react-content-loader'

export const CardContentPlaceholder: React.FC<{ uniqueKey?: string }> = (props) => (
  <ContentLoader
    uniqueKey={props.uniqueKey}
    height={500}
    speed={0}
    backgroundColor='rgb(243 244 246)'
    viewBox='0 0 300 400'
    {...props}
  >
    <circle cx='30' cy='30' r='15' />
    <rect x='58' y='24' rx='2' ry='2' width='140' height='10' />
    <rect x='15' y='80' rx='10' ry='10' width='80' height='16' />
    <rect x='105' y='80' rx='10' ry='10' width='80' height='16' />
  </ContentLoader>
)
