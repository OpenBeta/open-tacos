import React from 'react'
import { render, screen, fireEvent, waitFor, RenderResult } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AreaLatLngForm } from '../AreaLatLngForm'
import { FormProvider, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))
jest.mock('../../../../../../../js/graphql/Client.ts')
jest.mock('../../../../../../../components/maps/CoordinatePickerMap.tsx', () => ({
  CoordinatePickerMap: () => <div data-testid='coordinate-picker-map' />
}))

const renderWithForm = (component: React.ReactElement): RenderResult => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const methods = useForm()
    return <FormProvider {...methods}>{children}</FormProvider>
  }
  return render(<Wrapper>{component}</Wrapper>)
}

describe('AreaLatLngForm', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: { accessToken: 'test-token' } })
  })

  test('renders without crashing', async () => {
    renderWithForm(<AreaLatLngForm initLat={0} initLng={0} uuid='test-uuid' isLeaf areaName='Test Area' />)
    await waitFor(() => {
      expect(screen.getByText('Coordinates')).toBeInTheDocument()
    })
  })

  test('renders coordinate input when isLeaf is true', async () => {
    renderWithForm(<AreaLatLngForm initLat={0} initLng={0} uuid='test-uuid' isLeaf areaName='Test Area' />)
    await waitFor(() => {
      expect(screen.getByLabelText('Coordinates in latitude, longitude format.')).toBeInTheDocument()
    })
  })

  test('renders message when isLeaf is false', async () => {
    renderWithForm(<AreaLatLngForm initLat={0} initLng={0} uuid='test-uuid' isLeaf={false} areaName='Test Area' />)
    await waitFor(() => {
      expect(screen.getByText("Coordinates field available only when area type is either 'Crag' or 'Boulder'.")).toBeInTheDocument()
    })
  })

  test('triggers the coordinate picker map dialog', async () => {
    renderWithForm(<AreaLatLngForm initLat={0} initLng={0} uuid='test-uuid' isLeaf areaName='Test Area' />)
    fireEvent.click(screen.getByText('Picker'))
    await waitFor(() => {
      expect(screen.getByTestId('coordinate-picker-map')).toBeInTheDocument()
    })
  })
})
