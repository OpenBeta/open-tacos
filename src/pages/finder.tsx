import { useRouter } from 'next/router'
import NProgress from 'nprogress/nprogress'

import useCragFinder from '../js/hooks/finder/useCragFinder'
import Layout from '../components/layout'
import CragsMap from '../components/maps/CragsMap'
import MobileMainView from '../components/finder/MobileMainView'
import CragTable from '../components/finder/CragTable'
import Pagination from '../components/finder/Pagination'
import TwoColumnLayout from '../components/finder/TwoColumnLayout'
import useResponsive from '../js/hooks/useResponsive'
import { Preface } from '../components/finder/Preface'

NProgress.configure({ showSpinner: false, easing: 'ease-in-out', speed: 1000 })

export default function Finder (): JSX.Element {
  const { isTablet, isMobile } = useResponsive()
  const cragFiltersStore = useCragFinder(useRouter())
  const { total, searchText, isLoading } = cragFiltersStore.useStore()
  if (isLoading) {
    NProgress.start()
  } else {
    NProgress.done()
  }
  return (
    <Layout
      rootContainerClass='root-container-full'
      contentContainerClass='content-mobile xl:content-default'
    >
      {isMobile || isTablet
        ? <MobileMainView
            listView={
              <div className='px-4'>
                <Preface isLoading={isLoading} total={total} searchText={searchText} />
                <CragTable />
                <Pagination />
              </div>
        }
            mapView={<CragsMap />}
          />
        : <TwoColumnLayout
            left={
              <>
                <Preface isLoading={isLoading} total={total} searchText={searchText} />
                <CragTable />
                <Pagination />
              </>
            }
            right={<CragsMap />}
          />}
    </Layout>
  )
}
