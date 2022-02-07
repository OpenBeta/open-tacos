import FeatureCard from './FeatureCard'
export default FeatureCard

export interface OpenverseImage {
  creator: string | undefined
  url: string
  attribution: string | undefined
  license: string
  license_url: string
}
