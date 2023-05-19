import { computed, ref } from 'vue'
import type { Player } from '@/types.d'

const newPlayer = (name: string): Player => ({
  name,
  level: 1,
  scoreByLevel: {}
})

const playerStorageKey = 'player'

const retrievePlayer = (): Player => {
  const data = localStorage.getItem(playerStorageKey)
  return data ? JSON.parse(data) : newPlayer('player')
}

const persistPlayer = (player: Player) => {
  localStorage.setItem(playerStorageKey, JSON.stringify(player))
}

export const _player = ref<Player>(retrievePlayer())

export const completeLevel = (level: number, score: number) => {
  _player.value.scoreByLevel[level] = score
  _player.value.level = level

  persistPlayer(_player.value)
}

const totalScore = computed(() => Object.values(_player.value.scoreByLevel).reduce((sum, score) => sum + score, 0))

export const player = computed(() => ({
  ..._player.value,
  totalScore
}))
