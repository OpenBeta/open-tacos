const data = [
  {
    center: [-115.42471800000001, 36.133857],
    context: [{ id: 'postcode.11472100429866660', text: '89161' }],
    geometry: { coordinates: [-115.42471800000001, 36.133857], type: 'Point' },
    id: 'poi.790274062671',
    place_name: 'Red Rock Canyon National Conservation Area, 1000 Scenic Dr, Las Vegas, Nevada 89161, United States',
    place_type: ['poi'],
    properties: { foursquare: '4b92f2f3f964a520a22934e3', landmark: true, wikidata: 'Q1143382' },
    relevance: 1,
    text: 'Red Rock Canyon National Conservation Area',
    type: 'Feature'
  }]

export const geocoderLookup = jest.fn()

geocoderLookup.mockReturnValue(data)
