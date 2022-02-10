import FeatureCard from './FeatureCard'
export default FeatureCard

export interface OpenverseImage {
  creator: string | undefined
  url: string
  attribution: string | undefined
  license: string
  license_url: string
}

export interface OpenverseResponse {
  result_count: number
  page_count: number
  page_size: number
  page: number
  results: OpenverseImage[]
}
