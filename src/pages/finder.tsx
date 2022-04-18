
import Layout from '../components/layout'
import DataContainer from '../components/finder/DataContainer'

const Finder = (): JSX.Element => {
  return (
    <Layout
      rootContainerClass='root-container-full'
      contentContainerClass='content-mobile xl:content-default'
    >
      <DataContainer />
    </Layout>
  )
}
export default Finder
