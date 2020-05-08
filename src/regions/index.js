import devZone from './devZone'
import homeBase from './homeBase'
import underTheSea from './underTheSea'

const regions = [
  devZone,
  homeBase,
  underTheSea,
]

export const levels = regions.flatMap(region => region.levels)

export default regions
