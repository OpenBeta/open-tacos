import { GetStaticProps, NextPage } from 'next'

import { getChangeHistory } from '../../js/graphql/contribAPI'
import RecentChangeHistory from '../../components/contribs/RecentChangeHistory'
interface PageProps {
  history: any[]
}
const Page: NextPage<PageProps> = ({ history }: PageProps) => {
  return (
    <section>
      <div>foos</div>
      <div>{JSON.stringify(history, null, 2)}</div>
      <RecentChangeHistory history={history} />
    </section>
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
