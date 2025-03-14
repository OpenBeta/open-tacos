import { notFound } from 'next/navigation'
import { validate } from 'uuid'
import { Metadata } from 'next'
import { FetchPolicy } from '@apollo/client'
import { Climb } from '@/js/types'
import { ArrowUUpLeft } from '@phosphor-icons/react/dist/ssr'

import { AreaCrumbs } from '@/components/breadcrumbs/AreaCrumbs'
import { getClimbPageFriendlyUrl } from '@/js/utils'
import { getClimbByIdRSC } from '@/js/graphql/getClimbRSC'

import { PageContainer, SectionContainer } from '../../components/AreaAndClimb/EditAreaContainers'
import { SidebarNav } from './components/SidebarNav'
import { ClimbNameForm } from './components/ClimbNameForm'
import { ClimbDescriptionForm } from './components/ClimbDescriptionForm'
import { ClimbLocationForm } from './components/ClimbLocationForm'
import { ClimbProtectionForm } from './components/ClimbProtectionForm'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

// Page metadata
export async function generateMetadata ({ params }: DashboardPageProps): Promise<Metadata> {
  const pageDataForEdit = await getPageDataForEdit(params.slug, 'cache-first')
  if (pageDataForEdit == null) {
    return {}
  }

  const { name } = pageDataForEdit
  return {
    title: `Editing climb ${String(name)}`
  }
}

export interface DashboardPageProps {
  params: {
    slug: string
  }
}

export default async function ClimbEditPage ({ params }: DashboardPageProps): Promise<any> {
  const pageDataForEdit = await getPageDataForEdit(params.slug)
  if (pageDataForEdit == null) {
    notFound()
  }

  const {
    id, name, content, ancestors, pathTokens, parent
  } = pageDataForEdit

  return (
    <div className='relative w-full h-full'>
      <div className='px-12 pt-8 pb-4'>
        <div className='text-3xl tracking-tight font-semibold'>Edit climb</div>

        <div className='text-sm flex justify-end'>
          <a
            href={getClimbPageFriendlyUrl(id, name)}
            className='flex items-center gap-2 hover:underline'
          >
            Return to public version <ArrowUUpLeft size={18} />
          </a>
        </div>
      </div>

      <div className='bg-base-200'>
        <div className='z-20 sticky top-0 py-2 px-6 bg-base-200 w-full border-t border-b'>
          <AreaCrumbs pathTokens={pathTokens} ancestors={ancestors} editMode />
        </div>
        <div className='flex bg-base-200 flex-col lg:flex-row py-12'>
          <SidebarNav uuid={id} pageDataForEdit={pageDataForEdit} parentId={parent.uuid} />
          <main className='relative h-full w-full px-2 lg:px-16'>
            <PageContainer>
              <SectionContainer id='general'>
                <ClimbNameForm initialValue={name} uuid={id} parentId={parent.uuid} />
              </SectionContainer>

              <SectionContainer id='description'>
                <ClimbDescriptionForm initialValue={content?.description} uuid={id} parentId={parent.uuid} />
              </SectionContainer>

              <SectionContainer id='location'>
                <ClimbLocationForm initialValue={content?.location} uuid={id} parentId={parent.uuid} />
              </SectionContainer>

              <SectionContainer id='protection'>
                <ClimbProtectionForm initialValue={content?.protection} uuid={id} parentId={parent.uuid} />
              </SectionContainer>
            </PageContainer>
          </main>
        </div>
      </div>
    </div>
  )
}

const getPageDataForEdit = async (pageSlug: string, fetchPolicy?: FetchPolicy): Promise<Climb | null> => {
  if (pageSlug == null) notFound()

  if (!validate(pageSlug)) {
    notFound()
  }

  const pageData = await getClimbByIdRSC(pageSlug, fetchPolicy)
  if (pageData == null) {
    notFound()
  }
  return pageData
}
