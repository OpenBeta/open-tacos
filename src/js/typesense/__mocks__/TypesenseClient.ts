const CLIMB1 = {
  areaNames: ['US', 'Utah', 'West Desert', 'Ibex', 'Corral Crags', 'North Corral Crag'],
  climbId: '625f2835ebeebbbc783a907f',
  climbName: 'Red Rock',
  climbUUID: '973ebc07-e475-5533-8671-8c4235cb93fc',
  cragLatLng: [38.98536, -113.3912],
  fa: 'Jason Stevens and Noah Stevens (6 years old), 2003',
  grade: '5.4',
  id: '175019',
  safety: 'UNSPECIFIED',
  disciplines: ['trad', 'sport']
}

export const multiSearch = jest.fn()
  .mockReturnValue({
    climbs: [CLIMB1],
    areas: [],
    fa: []
  })

export const climbSearchByName = jest.fn()
  .mockReturnValue([CLIMB1])
