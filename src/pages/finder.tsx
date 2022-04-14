
import Layout from '../components/layout'
import DataContainer from '../components/finder/DataContainer'

const Finder = (): JSX.Element => {
  return (
    <Layout
      mainContainerClass='main-container-max'
      contentContainerClass='content-mobile xl:content-fullscreen-desktop'
    >
      <DataContainer />
    </Layout>
  )
}
export default Finder
