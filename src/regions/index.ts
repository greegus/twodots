import { devZoneRegion } from '@/regions/devZone'
import { homebaseRegion } from '@/regions/homeBase'
import { underTheSeaRegion } from '@/regions/underTheSea'

export const regions = [
  devZoneRegion,
  homebaseRegion,
  underTheSeaRegion,
]

export const levels = regions.flatMap(region => region.levels)
