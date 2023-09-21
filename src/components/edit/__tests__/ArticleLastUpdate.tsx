import { render, screen } from '@testing-library/react'
import { AuthorMetadata } from '../../../js/types'

jest.mock('../../../assets/icons/tree.svg', () => 'svg')

describe('Article last update', () => {
  let ArticleLastUpdate
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    ArticleLastUpdate = await import('../ArticleLastUpdate').then(module => module.ArticleLastUpdate)
  })

  test('component handles null props', async () => {
    render(<ArticleLastUpdate />)
    const links = await screen.queryAllByRole('link')
    expect(links).toHaveLength(0)
  })

  test('component linking to editor profiles', async () => {
    const data: AuthorMetadata = {
      createdAt: new Date(1673595471992),
      createdByUser: 'jane doe',
      updatedAt: new Date(1674761647299),
      updatedByUser: 'Yamada Hanako'
    }
    render(<ArticleLastUpdate {...data} />)
    const links = await screen.findAllByRole('link')
    expect(links).toHaveLength(2)
  })
})
