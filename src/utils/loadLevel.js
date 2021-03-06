import config from 'config'
import { levels } from 'regions'

export default function loadLevel(levelId) {
  const level = levels.find(level => level.id === levelId)

  return {
    ...level,
    theme: {
      ...config.defaultTheme,
      ...(level.theme || {})
    }
  }
}