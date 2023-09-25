import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { PhotoGalleryModalProps } from '../PhotoGalleryModal'

describe('<PhotoGalleryModal />', () => {
  // Mock the userMediaStore
  jest.mock('../../../js/stores/media', () => ({
    userMediaStore: {
      use: {
        photoList: jest.fn(() => [
          {
            mediaUrl: 'test.jpg',
            width: 200,
            height: 200,
            entityTags: []
          }
        ])
      }
    }
  }))

  jest.mock('../TagList', () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid='mockedTagList'>tag list</div>)
  }))

  jest.mock('../AddTag', () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid='mockedAddTag'>add tag</div>)
  }))

  let PhotoGalleryModal: React.FC<PhotoGalleryModalProps>

  beforeAll(async () => {
    const module = await import('../PhotoGalleryModal')
    PhotoGalleryModal = module.default
  })

  test('renders without crashing', () => {
    const { getByTestId } = render(<PhotoGalleryModal setShowPhotoGalleryModal={jest.fn()} />)
    expect(getByTestId('thumbnail')).toBeInTheDocument()
  })
})
