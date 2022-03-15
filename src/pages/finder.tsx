import Layout from '../components/layout'
import DataContainer from '../components/finder/DataContainer'
import CragFilters from '../components/finder/filters'

const Finder = (): JSX.Element => {
  return (
    <Layout
      layoutClz='layout-wide'
      subheader={<CragFilters />}
    >
      <DataContainer />
    </Layout>
  )
}
export default Finder
