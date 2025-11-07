import React from 'react'

interface BarPercentProps {
  percents?: number[]
  colors?: string[]
  styles?: string
}

declare const BarPercent: React.FC<BarPercentProps>
export default BarPercent
