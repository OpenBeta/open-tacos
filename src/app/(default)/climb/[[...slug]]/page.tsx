import { notFound } from 'next/navigation'

import { AreaCrumbs } from '@/components/breadcrumbs/AreaCrumbs'
import { AreaPageContainer } from '../../components/ui/AreaPageContainer'
import PhotoMontage, { UploadPhotoCTA } from '@/components/media/PhotoMontage'
import { StickyHeaderContainer } from '../../components/ui/StickyHeaderContainer'
import { parseUuidAsFirstParam, climbLeftRightIndexComparator } from '@/js/utils'
import { PageWithCatchAllUuidProps } from '@/js/types/pages'
import { getClimbById } from '@/js/graphql/api'
import { ClimbData } from './components/ClimbData'
import { ContentBlock } from './components/ContentBlock'
import { Summary } from '../../components/ui/Summary'
import { SiblingClimbs } from './components/SiblingClimbs'
import { LazyAreaMap } from '@/components/maps/AreaMap'
import { ClimbType } from '@/js/types'
import { NeighboringRoutesNav } from '@/components/crag/NeighboringRoute'

export default async function Page ({ params }: PageWithCatchAllUuidProps): Promise<any> {
  const climbId = parseUuidAsFirstParam({ params })
  const climb = await getClimbById(climbId)
  if (climb == null) {
    notFound()
  }

  const photoList = climb.media

  const {
    id, ancestors, pathTokens, parent
  } = climb

  let leftClimb: ClimbType | null = null
  let rightClimb: ClimbType | null = null

  const sortedClimbs = [...parent.climbs].sort(climbLeftRightIndexComparator)

  for (const [index, climb] of sortedClimbs.entries()) {
    if (climb.id === id) {
      leftClimb = (sortedClimbs[index - 1] != null) ? sortedClimbs[index - 1] : null
      rightClimb = sortedClimbs[index + 1] != null ? sortedClimbs[index + 1] : null
    }
  }

  return (
    <AreaPageContainer
      photoGallery={
                photoList.length === 0
                  ? <UploadPhotoCTA />
                  : <PhotoMontage photoList={photoList} />
        }
      // pageActions={<AreaPageActions areaName={areaName} uuid={uuid} />}
      breadcrumbs={
        <StickyHeaderContainer>
          <AreaCrumbs pathTokens={pathTokens} ancestors={ancestors} />
        </StickyHeaderContainer>
        }
      leftRightNav={<NeighboringRoutesNav climbs={[leftClimb, rightClimb]} parentArea={parent} />}
      summary={{
        left: <ClimbData {...climb} />,
        right: <ContentBlock content={climb.content} />
      }}
      map={(
        <LazyAreaMap
          focused={null}
          selected={climb.parent.id}
          subAreas={[]}
          area={climb.parent}
        />)}
      mapContainerClass='block lg:hidden h-[90vh] w-full'
    >
      <hr className='border-1 my-8' />
      <Summary
        columns={{
          left: <SiblingClimbs parentArea={climb.parent} climbId={id} />,
          right: (
            <div className='hidden lg:min-h-[500px] lg:h-full lg:block lg:relative'>
              <LazyAreaMap
                focused={null}
                selected={climb.parent.id}
                subAreas={[]}
                area={climb.parent}
              />
            </div>)
        }}
      />
      <div className='mt-16' />
    </AreaPageContainer>
  )
}
