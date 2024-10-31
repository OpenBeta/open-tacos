import { notFound } from 'next/navigation'

import { AreaCrumbs } from '@/components/breadcrumbs/AreaCrumbs'
import { AreaPageContainer } from '../../components/ui/AreaPageContainer'
import PhotoMontage, { UploadPhotoCTA } from '@/components/media/PhotoMontage'
import { StickyHeaderContainer } from '../../components/ui/StickyHeaderContainer'
import { parseUuidAsFirstParam } from '@/js/utils'
import { PageWithCatchAllUuidProps } from '@/js/types/pages'
import { getClimbById } from '@/js/graphql/api'
import { ClimbData } from './components/ClimbData'
import { ContentBlock } from './components/ContentBlock'
import { Summary } from '../../components/ui/Summary'
import { SiblingClimbs } from './components/SiblingClimbs'
import { LazyAreaMap } from '@/components/maps/AreaMap'

export default async function Page ({ params }: PageWithCatchAllUuidProps): Promise<any> {
  const climbId = parseUuidAsFirstParam({ params })
  const climb = await getClimbById(climbId)
  if (climb == null) {
    notFound()
  }

  const photoList = climb.media

  const {
    id, ancestors, pathTokens
  } = climb
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
