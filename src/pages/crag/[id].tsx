import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { shuffle } from 'underscore'

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { AreaType, ChangesetType } from '../../js/types'
import { PageMeta } from '../areas/[id]'
import PhotoMontage from '../../components/media/PhotoMontage'
import { UploadCTACragBanner } from '../../components/media/UploadCTA'
import CragSummary, { Skeleton as AreaContentSkeleton } from '../../components/crag/cragSummary'
import { QUERY_AREA_BY_ID } from '../../js/graphql/gql/areaById'

interface CragProps {
  area: AreaType
  history: ChangesetType[]
}

const CragPage: NextPage<CragProps> = (props) => {
  const { isFallback } = useRouter()
  return (
    <>
      {!isFallback && <PageMeta {...props} />}
      <Layout contentContainerClass='content-default' showFilterBar={false}>
        <Body {...props} />
      </Layout>
    </>
  )
}
export default CragPage

const Body = ({ area, history }: CragProps): JSX.Element => {
  const level = area?.ancestors.length ?? 0
  const { isFallback: showSkeleton } = useRouter()
  const photoList = area?.media ?? []
  return (
    <>
      <article className='article'>
        <PhotoMontage isHero photoList={shuffle(photoList)} showSkeleton={showSkeleton} />
        {photoList?.length === 0 && level > 2 && <UploadCTACragBanner />}
        <div className='mt-6 first:mt-0'>
          {showSkeleton
            ? <AreaContentSkeleton />
            : <CragSummary
                key={area.uuid}
                area={area}
                history={history}
              />}
        </div>
      </article>

      {!showSkeleton &&
        <div id='#map' className='w-full mt-16' style={{ height: '30rem' }}>
          <AreaMap
            focused={null}
            selected={area.id}
            subAreas={[{ ...area }]}
            area={area}
          />
        </div>}
    </>
  )
}

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [
      // { params: { id: 'bea6bf11-de53-5046-a5b4-b89217b7e9bc' } }, // Red Rock
      // { params: { id: '78da26bc-cd94-5ac8-8e1c-815f7f30a28b' } }, // Red River Gorge
      // { params: { id: '1db1e8ba-a40e-587c-88a4-64f5ea814b8e' } }, // USA
      // { params: { id: 'ab48aed5-2e8d-54bb-b099-6140fe1f098f' } }, // Colorado
      // { params: { id: 'decc1251-4a67-52b9-b23f-3243e10e93d0' } }, // Boulder
      // { params: { id: 'f166e672-4a52-56d3-94f1-14c876feb670' } } // Indian Creek
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<CragProps, { id: string }> = async ({ params }) => {
  if (params?.id == null) {
    return {
      notFound: true
    }
  }

  const rs = await graphqlClient.query<{ area: AreaType, getAreaHistory: ChangesetType[] }>({
    query: QUERY_AREA_BY_ID,
    variables: {
      uuid: params.id
    },
    fetchPolicy: 'no-cache'
  })

  if (rs?.data == null || rs?.data?.area == null) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      area: rs.data.area,
      history: rs.data.getAreaHistory
    },
    revalidate: 30
  }
}

export const AreaMap = dynamic<any>(async () => await import('../../components/area/areaMap'), {
  ssr: false
})
