import { notFound, permanentRedirect } from 'next/navigation'

import { AreaCrumbs } from '@/components/breadcrumbs/AreaCrumbs'
import { DefaultPageContainer } from '../../components/ui/DefaultPageContainer'
import PhotoMontage, { UploadPhotoCTA } from '@/components/media/PhotoMontage'
import { StickyHeaderContainer } from '../../components/ui/StickyHeaderContainer'
import { parseUuidAsFirstParam, climbLeftRightIndexComparator, getFriendlySlug, getClimbPageFriendlyUrl } from '@/js/utils'
import { PageWithCatchAllUuidProps } from '@/js/types/pages'
import { getClimbByIdRSC } from '@/js/graphql/getClimbRSC'
import { ClimbData } from './components/ClimbData'
import { ContentBlock } from './components/ContentBlock'
import { Summary } from '../../components/ui/Summary'
import { SiblingClimbs } from './components/SiblingClimbs'
import { LazyAreaMap } from '@/components/maps/AreaMap'
import { ClimbType, TagTargetType } from '@/js/types'
import { NeighboringRoutesNav } from '@/components/crag/NeighboringRoute'
import { AreaAndClimbPageActions } from '../../components/AreaAndClimbPageActions'
import { PageAlert } from './components/PageAlert'
/**
 * Page cache settings
 */
export const revalidate = 2592000 // 30 days

/**
 * Climb page
 */
export default async function Page ({ params }: PageWithCatchAllUuidProps): Promise<any> {
  const climbId = parseUuidAsFirstParam({ params })
  const climb = await getClimbByIdRSC(climbId)
  if (climb == null) {
    notFound()
  }

  const userProvidedSlug = getFriendlySlug(params.slug?.[1] ?? '')

  const photoList = climb.media

  const {
    id, name, type, ancestors, pathTokens, parent
  } = climb

  const correctSlug = getFriendlySlug(name)

  if (correctSlug !== userProvidedSlug) {
    permanentRedirect(getClimbPageFriendlyUrl(id, name))
  }

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
    <DefaultPageContainer
      heroAlert={<PageAlert id={id} />}
      photoGallery={
                photoList.length === 0
                  ? <UploadPhotoCTA />
                  : <PhotoMontage photoList={photoList} />
        }
      pageActions={<AreaAndClimbPageActions name={name} uuid={id} targetType={TagTargetType.climb} parentUuid={parent.uuid} />}
      breadcrumbs={
        <StickyHeaderContainer>
          <AreaCrumbs pathTokens={pathTokens} ancestors={ancestors} />
        </StickyHeaderContainer>
        }
      leftRightNav={<NeighboringRoutesNav climbs={[leftClimb, rightClimb]} parentArea={parent} />}
      summary={{
        left: <ClimbData {...climb} isBoulder={type.bouldering} gradeContext={parent.gradeContext} />,
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
            <div id='map' className='hidden lg:min-h-[500px] lg:h-full lg:block lg:relative'>
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
    </DefaultPageContainer>
  )
}
