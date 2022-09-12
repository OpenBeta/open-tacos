import { GetStaticProps, NextPage } from 'next'

import { getChangeHistory } from '../../js/graphql/contribAPI'
import RecentChangeHistory from '../../components/contribs/RecentChangeHistory'
import DefaultView from '../../components/contribs/DefaultView'
interface PageProps {
  history: any[]
}
const Page: NextPage<PageProps> = ({ history }: PageProps) => {
  return (
    <>
      {/* <pre>{JSON.stringify(history, null, 2)}</pre> */}
      <DefaultView />
      <section className='max-w-sm mx-auto'>
        <h2>Recent history</h2>
        <RecentChangeHistory history={history} />
      </section>
    </>
  )
}
export default Page

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }): Promise<any> => {
  const history = await getChangeHistory()
  return ({
    props: {
      history,
      revalidate: 10 // regenerate page when a request comes in but no faster than every 10s
    }
  })
}
