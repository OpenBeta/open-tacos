import { AreaType } from '@/js/types'

export type ToCArea = Pick<AreaType, 'uuid' | 'areaName'>
export type ToCCountry = Pick<AreaType, 'uuid' | 'areaName'> & {
  children: ToCArea[]
}

export const INTERNATIONAL_DATA: ToCCountry[] = [
  {
    areaName: 'Canada',
    uuid: '2996145f-e1ba-5b56-9da8-30c64ccc3776',
    children: [{
      uuid: 'a354b580-870b-5444-9f11-2c0e78995841',
      areaName: 'Squamish'
    },
    {
      uuid: '4624f40a-b644-5256-9287-aa19002ce00f',
      areaName: 'Powell River'
    },
    {
      uuid: 'a33bf360-9bf1-5d0f-b082-9ef3a51aa231',
      areaName: 'Skaha'
    },
    {
      uuid: '26913742-ffc5-5c8f-834b-7f0cd1b58d81',
      areaName: 'The Bugaboos'
    },
    {
      uuid: 'fa6ebe07-759f-5a35-b715-c39bbb8424d2',
      areaName: 'Lake Louise'
    }
    ]
  },
  {
    areaName: 'South Africa',
    uuid: '1d33c773-e381-5b8a-a13f-3dfd7991732b',
    children: [{
      uuid: '4ed6c976-ee02-564a-801e-20ccc10e6e26',
      areaName: 'Rocklands'
    }
    ]
  }
]
