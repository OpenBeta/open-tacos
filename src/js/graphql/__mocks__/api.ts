export const getCragDetailsNear = jest.fn().mockImplementation(() => {
  console.log('## mock graphql')
  return {
    data: [],
    error: 'API error',
    placeId: undefined
  }
})
