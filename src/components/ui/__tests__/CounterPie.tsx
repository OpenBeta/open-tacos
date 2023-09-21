import React from 'react'
import ''
import { render } from '@testing-library/react'
import renderer from 'react-test-renderer'
import CounterPie from '../Statistics/CounterPie'

const total = 18
const forYou = 14

// not having width and height props was breaking the component rendering in test
// solution: https://github.com/recharts/recharts/issues/727#issuecomment-758556820
test('that component will not render without width and height', () => {
  const { container } = render(<CounterPie total={total} forYou={forYou} />)
  const sectors = container.getElementsByClassName('recharts-pie-sector')
  expect(sectors.length).toBe(0)
})

test('that there are 2 parts to the pie chart', async () => {
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(96)
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(96)
  // there should only ever be 2 sectors because of data shape below
  // const data = [
  //     { name: 'total', value: total - forYou },
  //     { name: 'forYou', value: forYou }
  //   ]
  const { container } = render(<CounterPie total={total} forYou={forYou} />)
  const sectors = container.getElementsByClassName('recharts-pie-sector')
  expect(sectors.length).toBe(2)
})

it('renders correctly', () => {
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(96)
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(96)
  const tree = renderer
    .create(<div style={{ width: '100px', height: '100px' }}><CounterPie total={total} forYou={forYou} /></div>)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
