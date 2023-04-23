import { LCOProfileType } from './PageBanner'

/**
 * A hand-coded list of LCOs.
 * Use https://www.uuidgenerator.net to generate a new `id`
 */
export const LCO_LIST: LCOProfileType[] = [
  {
    id: 'a791edd2-6a19-4f12-b69d-cbd499fed81f',
    areaIdList: [
      'e519a674-a620-509c-9e86-a246f84a8e40',
      '8af5df63-9dd1-5fb2-9ef1-c3c3860494f5',
      '9c4813f1-30d1-5705-96de-19a23e027a4b',
      '1621a45a-659f-5708-9ba0-bc0a295bfc73',
      '10f12d5c-d05a-52d0-ae46-729c528928e5',
      '279c5542-b8d6-5385-b9f0-746ce842d276'
    ],
    name: 'Boulder Climbing Community',
    instagram: 'https://www.instagram.com/boulderclimbingcommunity/',
    website: 'https://www.boulderclimbers.org/',
    report:
      'https://docs.google.com/forms/d/e/1FAIpQLSfRditFRHJIt7ayZ1SPet2gkl5wh7QF8DnoqRGf1kdzCgegQg/viewform',
    donation:
      'https://secure.givelively.org/donate/boulder-climbing-community/donation'
  },
  {
    id: 'ad96a3d9-bbd1-4680-84a0-de9c69eed184',
    areaIdList: ['d0ca78b6-a3cb-517c-adee-d9c6f8c2d2d8'],
    name: 'Flatirons Climbing Council',
    instagram: 'https://www.instagram.com/flatironsclimbingcouncil/',
    website: 'http://flatironsclimbing.org/',
    report:
      'https://docs.google.com/forms/d/e/1FAIpQLSfRditFRHJIt7ayZ1SPet2gkl5wh7QF8DnoqRGf1kdzCgegQg/viewform',
    donation:
      'https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=YPUFRGB5N2AVG&ssrt=1680716384172'
  },
  {
    id: '8801b124-ab19-4b66-a292-738dc56e446a',
    areaIdList: [
      'c80d3abd-beab-5467-a559-edee707f68bd', // Portland & The Gorges
      '5049661c-2645-50ff-8014-3e7d2ccc9e85', // Salmon River Slab
      'a51e21da-e030-55d8-bd9a-6b2f72cd231b', // Klinger
      'a8c395e6-9bbd-53ab-ba22-43995142b470', // Beacon
      '5d419be0-d681-5e88-94a5-deed944a8858', // Broughton
      '45affe93-ba19-5bfb-a669-6901023757b0', // Windy Slab
      '2858fd99-5be0-583b-b0c0-46e209c9c12f', // Horsethief Butte
      'fa779d3f-22b4-5dd5-aba1-ef9591d777e9', // Wankers Columns
      '4a47ee10-2531-5c3d-a8ea-079f71bde25b', // Viento
      'ba9c7d16-5a0c-51e3-8400-f1dc81afd50b', // Rat Cave
      '5ad1a804-7251-59fb-86cb-a036e196fb7c', // Kiwanis Camp
      '5049661c-2645-50ff-8014-3e7d2ccc9e85', // Salmon Slab
      '8646d6ae-eb75-504c-9044-b08d20a332fd', // OH8
      'e5e1d75f-d366-5b53-b4ba-b1928fdbec39', // Frenchs Dome
      'a51e21da-e030-55d8-bd9a-6b2f72cd231b', // Klinger Spring
      '396b0bdd-3bd1-55c7-9d49-30ca444de388', // Pete's Pile
      '5dea36f8-5e98-59c3-8729-73e16c587e86', // Area 51
      'aff23abf-5b90-5ae7-82de-649109983d92', // Bulo Point
      'd6cb3e79-ee40-5357-9a3f-f9a700a04c68', // Empire Boulders
      // '', // TLC (cannot find / doesn't exist in openbeta db)
      'b70dddf3-91ec-54ef-b6de-3ed3a01b98c5' // Hunchback

      // want to have, but access isn't formalized yet
      // '079f2530-9cd1-5d5c-9b98-3088064aba5e', // Ozone
      // '95ec7508-9c43-58f4-b498-f13e6dbe4d9a', // Farside/Dropzone
      // '51acd6f2-632c-5490-a408-70519608514b' // Rocky Butte
    ],
    name: 'Portland Area Climbers Coalition',
    instagram: 'https://www.instagram.com/portlandclimbing/',
    website: 'https://www.oregonclimbers.org/',
    report: 'https://forms.gle/BofUZFFhF6Ann1oZ7'
  },
  {
    id: 'ee25d0f6-842e-4f43-b9ac-f90ff1fe3a9d',
    areaIdList: [
      'c1fdee82-93e7-5a55-9103-7defbe7f0b10' // Central AZ
    ],
    name: 'Central Arizona Bolt Replacement Program',
    instagram: 'https://www.instagram.com/centralarizonaboltreplacement/',
    website: 'https://cabrp.org/',
    report: 'https://cabrp.org/contact',
    donation: 'https://cabrp.org/donate'
  }
]
