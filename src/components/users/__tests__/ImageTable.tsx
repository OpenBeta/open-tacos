import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { groupBy } from 'underscore'

jest.mock('../../../js/sirv/SirvClient')
jest.mock('../../../js/graphql/api')
jest.mock('../../../js/graphql/Client')

const sirvClient = jest.requireMock('../../../js/sirv/SirvClient')
const graphApi = jest.requireMock('../../../js/graphql/api')

let ImageTable

beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
  const module = await import('../ImageTable')
  ImageTable = module.default
})

test('ImageTable can render', async () => {
  /* Replicate getStaticProps() in /pages/[uid].tsx */
  const { mediaList } = await sirvClient.getUserImages('coolusername', 'verysecrettoken')
  const tagArray = await graphApi.getTagsByMediaId(['not important'])
  const tagsByMediaId = groupBy(tagArray, 'mediaUuid')

  render(
    <ImageTable
      uid='coolusername'
      imageList={mediaList}
      initialTagsByMediaId={tagsByMediaId}
    />)

  expect(screen.queryAllByRole('img').length).toBe(mediaList.length)
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})
