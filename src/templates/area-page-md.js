import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import { templateH1Css } from '../js/styles'
import SEOMeta from '../components/seo'
import Droppin from '../assets/icons/droppin.svg'
import Cta from '../components/ui/Cta'
import AreaCard from '../components/ui/AreaCard'
import EditButton from '../components/ui/EditButton'
/**
 * Templage for generating individual Area page
 */
export default function AreaPage ({ data }) {
  const { area_name: areaName, metadata } = data.openTaco.area
  const { content, children } = data.openTaco.area
  const rawPath = '/'
  const showEditCTA = content.description.length < 40
  return (
    <Layout layoutClz='layout-wide'>
      <SEOMeta
        keywords={[areaName]}
        title={areaName}
        description='description'
      />

      <div className='overflow-y'>
        <div className='xl:flex xl:flex-row xl:gap-x-4 xl:justify-center xl:items-stretch'>
          <div className='xl:flex-none xl:max-w-screen-md xl:w-full'>
            {/* <BreadCrumbs pathTokens={pathTokens} /> */}
            <h1 className={templateH1Css}>{areaName}</h1>
            <span className='flex items-center flex-shrink text-gray-500 text-xs gap-x-1'>
              <Droppin className='stroke-current' />
              <a
                className='hover:underline hover:text-gray-800'
                href={`https://www.openstreetmap.org/#map=13/${metadata.lat}/${metadata.lng}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {metadata.lat},{metadata.lng}
              </a>
            </span>
            {!showEditCTA && (
              <div className='flex justify-end'>
                <EditButton label='Improve this page' rawPath={rawPath} />
              </div>
            )}
            {showEditCTA && (
              <Cta isEmpty={content.description.words === 1} rawPath={rawPath} />
            )}
            <div
              className='markdown'
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            <hr className='my-8' />
            <>
              <div className='divide-x markdown h1'>Subareas</div>
              <div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-3 gap-y-3'>
                {children.map((node) => {
                  const { area_name: areaName, metadata, pathHash } = node
                  return (
                    <div className='max-h-96' key={metadata.area_id}>
                      <Link to={pathHash}>
                        <AreaCard areaName={areaName} />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ($areaId: ID!) {
    openTaco { 
      area(id: $areaId) {
        area_name
        metadata {
          isLeaf
          lat
          lng
          left_right_index
          mp_id
          area_id
        }
        content {
          description
        }
        children {
          area_name 
          metadata {
            area_id
          }
        }
      }
    }
  }
`
