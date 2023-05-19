import { config } from '@/config'
import { levels } from '@/regions'
import type { Level } from '@/types.d'

export const loadLevel = (levelId: number): Level => {
  const level = levels.find(level => level.id === levelId)!

  return {
    ...level,
    theme: {
      ...config.defaultTheme,
      ...(level.theme || {})
    }
  }
}