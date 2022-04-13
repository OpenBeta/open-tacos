
import Layout from '../components/layout'
import DataContainer from '../components/finder/DataContainer'

const Finder = (): JSX.Element => {
  return (
    <Layout
      layoutClz='layout-mobile lg:layout-wide'
    >
      <DataContainer />
    </Layout>
  )
}
export default Finder
