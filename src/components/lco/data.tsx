import { LCOProfileType } from './PageBanner'

/**
 * A hand-coded list of LCOs.
 * Use https://www.uuidgenerator.net to generate a new `id`
 */
export const LCO_LIST: LCOProfileType[] = [
  {
    id: 'a791edd2-6a19-4f12-b69d-cbd499fed81f',
    areaIdList: ['e519a674-a620-509c-9e86-a246f84a8e40', '8af5df63-9dd1-5fb2-9ef1-c3c3860494f5', '9c4813f1-30d1-5705-96de-19a23e027a4b', '1621a45a-659f-5708-9ba0-bc0a295bfc73', '10f12d5c-d05a-52d0-ae46-729c528928e5', '279c5542-b8d6-5385-b9f0-746ce842d276'],
    name: 'Boulder Climbing Community',
    instagram: 'https://www.instagram.com/boulderclimbingcommunity/',
    website: 'https://www.boulderclimbers.org/',
    report: 'https://docs.google.com/forms/d/e/1FAIpQLSfRditFRHJIt7ayZ1SPet2gkl5wh7QF8DnoqRGf1kdzCgegQg/viewform',
    donation: 'https://secure.givelively.org/donate/boulder-climbing-community/donation'
  }, {
    id: '8801b124-ab19-4b66-a292-738dc56e446a',
    areaIdList: [
      'c80d3abd-beab-5467-a559-edee707f68bd', // Portland & The Gorges
      '5049661c-2645-50ff-8014-3e7d2ccc9e85', // Salmon River Slab
      'a51e21da-e030-55d8-bd9a-6b2f72cd231b', // Klinger
      'a8c395e6-9bbd-53ab-ba22-43995142b470', // Beacon
      '079f2530-9cd1-5d5c-9b98-3088064aba5e' // Ozone
    ],
    name: 'Portland Area Climbers Coalition',
    instagram: 'https://www.instagram.com/portlandclimbing/',
    website: 'https://www.oregonclimbers.org/',
    report: 'https://forms.gle/BofUZFFhF6Ann1oZ7'
  }, {
    id: 'ee25d0f6-842e-4f43-b9ac-f90ff1fe3a9d',
    areaIdList: [
      'c1fdee82-93e7-5a55-9103-7defbe7f0b10', // Central AZ
    ],
    name: 'Central Arizona Bolt Replacement Program',
    instagram: 'https://www.instagram.com/centralarizonaboltreplacement/',
    website: 'https://cabrp.org/',
    report: 'https://cabrp.org/contact',
    donation: 'https://cabrp.org/donate'
  }
]
