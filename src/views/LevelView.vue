<script lang="ts" setup>
import { config } from '@/config'

import { createBombTile, createDotTile, createAnchorTile, isDot, isBomb, isWall, isRamp, isAnchor } from '@/utils/tiles'
import { isIce } from '@/utils/modifiers'
import { getRandomItem } from '@/utils/array'
import { generateGameboard, getAvailableDotSquares, hasAnyHorizontalMoves, hasAnyVerticalMoves } from '@/utils/gameboard'
import { createMatrix, getMatrixCell, getMatrixRow, setMatrixCell, getNeighbourCells, patterns } from '@/utils/matrix'
import { animateSparks } from '@/utils/effects'
import { hasId, hasPosition } from '@/utils/helpers'

import * as AudioService from '@/services/AudioService'

import LevelInterface from '@/components/LevelInterface.vue'

import GameboardTile from '@/components/canvas/GameboardTile.vue'
import GameboardModifier from '@/components/canvas/GameboardModifier.vue'
import SelectionProgressFrame from '@/components/canvas/SelectionProgressFrame.vue'
import WallsLayer from '@/components/canvas/WallsLayer.vue'
import Selection from '@/components/canvas/Selection.vue'

import SuccessModal from '@/modals/SuccessModal.vue'
import OutOfMovesModal from '@/modals/OutOfMovesModal.vue'
import type { DotColors, Goal, Level, Matrix, Modifier, Point, Size, Tile } from '@/types.d'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import { useModal } from 'vuiii'
import { useRouter } from 'vue-router'

// function getInitialState(level: Level) {
//   return {
//     ...generateGameboard(level),
//     movesLeft: level.moves,
//     goals: level.goals.map(goal => ({ ...goal, current: 0 })),
//     score: 0,
//     isSelectionDisabled: false
//   }
// }

function sumTilesScorePoinst(tiles) {
  return tiles.reduce((sum, tile) => {
    return sum + (tile.value || 1)
  }, 0)
}

async function sleep(time: number) {
  await new Promise(resolve => setTimeout(resolve, time))
}

const props = defineProps<{
  level: Level
}>()

const canvasRef = ref<HTMLCanvasElement>()

const size = ref<Size>({ width: 0, height: 0 })
const tiles = ref<Tile[]>([])
const modifiers = ref<Modifier[]>([])
const movesLeft = ref(0)
const goals = ref<Goal[]>([])
const score = ref(0)

const selection = ref<Tile[]>([])
const isMakingSelection = ref(false)
const isSelectionDisabled = ref(false)

// const tileComponentRefs = ref<Record<string, typeof GameboardTile>>({})
const tileComponentRefs = ref<Record<string, ComponentPublicInstance>>({})
const modifierComponentRefs = ref<Record<string, ComponentPublicInstance>>({})

const modal = useModal()
const router = useRouter()

const canvasSize = computed(() => {
  return {
    width: `${size.value.width / config.gameboardSize.width * 100}%`,
    height: `${size.value.height * config.tileSize}px`
  }
})

const tilesMatrix = computed(() => {
  const matrix = createMatrix<Tile>(size.value)

  tiles.value.forEach(tile => setMatrixCell(matrix, tile.position, tile))

  return matrix
})

const wallTiles = computed(() => tiles.value.filter(isWall))

const modifiersWithTile = computed(() => {
  return modifiers.value.map(modifier => ({
    ...modifier, tile: getMatrixCell(tilesMatrix.value, modifier.position)
  }))
})

const availableDotSquares = computed(() => getAvailableDotSquares(tilesMatrix.value))

const hasAnyMoveAvailable = computed(() => hasAnyHorizontalMoves(tilesMatrix.value) || hasAnyVerticalMoves(tilesMatrix.value))

const hasMetGoals = computed(() => {
  return goals.value.every(goal => {
    return goal.current >= goal.target
  })
})

const isLowOnMovesLeft = computed(() => {
  return movesLeft.value <= 5
})

const hasMovesLeft = computed(() => {
  return movesLeft.value > 0
})

// Methods

let squaresHighlightingInterval: ReturnType<typeof setInterval>

const cancelSquaresHighlighting = () => {
  squaresHighlightingInterval && clearInterval(squaresHighlightingInterval)
}

const initSquaresHighlighting = () => {
  squaresHighlightingInterval = setInterval(() => highlightRandomSquare(), 10000)
}


const highlightRandomSquare = () => {
  if (availableDotSquares.value.length) {
    animateTiles(getRandomItem(availableDotSquares.value), ref => ref.animateBeacon())
  }
}

const animateTiles = (tiles: Tile[], animationMapper: (ref: any) => void, refMapper = this.getTileContentComponent) => {
  return Promise.all([].concat(tiles).map(tile => animationMapper(refMapper(tile))))
}

const restart = () => {
  const gameboard = generateGameboard(props.level)

  size.value = gameboard.size
  tiles.value = gameboard.tiles
  modifiers.value = gameboard.modifiers
  movesLeft.value = props.level.moves,
    goals.value = props.level.goals.map(goal => ({ ...goal, current: 0 })),
    score.value = 0,
    isSelectionDisabled.value = false

  cancelSquaresHighlighting()
  initSquaresHighlighting()
}

const startSelection = () => {
  isMakingSelection.value = true
  cancelSquaresHighlighting()
}

const changeSelection = (payload: { selection: Tile[], isSelectionClosed: boolean, selectionColor: string, lastSelected?: Tile }) => {
  selection.value = payload.selection

  if (payload.isSelectionClosed) {
    getAllDotTilesOfColor(payload.selectionColor)
      .map(getTileContentComponent)
      .forEach(c => c.animateBeacon())
  }

  if (payload.lastSelected) {
    getTileContentComponent(payload.lastSelected).animateBeacon()
  }
}

const endSelection = async (payload: { selection: Tile[], enclosedTiles: Tile[], isSelectionClosed: boolean, selectionColor: string }) => {
  selection.value = []

  if (payload.selection.length > 1) {
    movesLeft.value = movesLeft.value - 1

    if (payload.isSelectionClosed) {
      payload.enclosedTiles.filter(tile => !tile.static).forEach(convertIntoBomb)
    }

    const tilesToPop = payload.isSelectionClosed
      ? getAllDotTilesOfColor(payload.selectionColor)
      : payload.selection

    await poppingRoutine(tilesToPop, payload.isSelectionClosed && payload.selectionColor)
  }

  if (hasMetGoals.value) {
    return completeLevel()
  }

  if (!hasMovesLeft.value) {
    return outOfMoves()
  }

  initSquaresHighlighting()

  isSelectionDisabled.value = false
}

const poppingRoutine = async (tilesToPop: Tile[], restrictedColor = undefined) => {
  // pop tiles

  let availableColors = restrictedColor
    ? props.level.colors.filter(color => color !== restrictedColor)
    : props.level.colors

  if (!availableColors.length) {
    availableColors = props.level.colors
  }

  const movements = []

  await popTiles(tilesToPop)

  movements.push(...fallDown())
  movements.push(...fillWithDots(availableColors))

  await animateMovements(movements)

  // bombs
  const bombs = tiles.value.filter(isBomb)

  if (bombs.length) {
    const tilesToPopByBomb = bombs.reduce((acc, bomb) => {
      const tiles = getNeighbourCells(tilesMatrix.value, bomb.position, patterns.SQUARE)
        .filter(tile => !tile.static)

      return acc.concat(tiles)
    }, [])

    await poppingRoutine(tilesToPopByBomb)
  }

  // anchors
  const sunkenAnchors = tiles.value
    .filter(isAnchor)
    .filter(tile => tile.position.y + 1 === size.value.height)

  if (sunkenAnchors.length) {
    return poppingRoutine(sunkenAnchors)
  }
}

const animateMovements = async (movements: Movement[]) => {
  return new Promise((resolve) => {
    nextTick(() => {
      const animations = movements
        .filter(({ waypoints }) => waypoints.length > 1)
        .map(({ tile, waypoints }) => getTileComponent(tile).animateFall(waypoints))

      Promise.all(animations).then(resolve)
    })
  })
}

const popTiles = async (tilesToPop: Tile[]) => {
  await sleep(150)

  crackTheIce(tilesToPop)
  accountTiles(tilesToPop)

  await animateTiles(tilesToPop, c => c.animateDestruction(), getTileComponent)

  tiles.value = tiles.value.filter(tile => !tilesToPop.some(hasId(tile.id)))
}

const crackTheIce = (tilesToPop: Tile[]) => {
  const icesToCrack = tilesToPop
    .map(tile => modifiers.value.find(hasPosition(tile.position)))
    .filter(Boolean)

  icesToCrack
    .forEach(ice => animateSparks(canvasRef.value!, ice.position))

  modifiers.value = modifiers.value
    .map(modifier => icesToCrack.some(hasId(modifier.id))
      ? { ...modifier, cracks: (modifier.cracks || 0) + 1 }
      : modifier
    )

  const icesToBreak = modifiers.value
    .filter(isIce).filter(ice => ice.cracks > 2)

  modifiers.value = modifiers.value
    .filter(modifier => !icesToBreak.some(hasId(modifier.id)))

  accountBrokenIceModifiers(icesToBreak)
}

const fallDown = () => {
  const computeFalldownPath = (position: Point, matrix: Matrix<Tile>): Point[] => {
    const cursor = position
    const waypoints = []

    while (++cursor.y < matrix.length) {
      const tile = getMatrixCell(matrix, cursor)

      if (!tile) {
        waypoints.push({ ...cursor })
        continue
      }

      if (isRamp(tile)) {
        waypoints.push(...computeFalldownPath({
          x: cursor.x + (tile.orientation === 'left' ? -1 : 1),
          y: cursor.y - 1
        }, matrix))

        continue
      }

      if (isWall(tile)) {
        waypoints.push(...computeFalldownPath({
          x: cursor.x,
          y: cursor.y + 1
        }, matrix))

        continue
      }

      break
    }

    return waypoints
  }

  const matrix = createMatrix(size.value)

  tiles.value.filter(tile => tile.static).forEach(tile => {
    setMatrixCell(matrix, tile.position, tile)
  })

  const movements = {}

  // Start from bottom to top, row by row
  for (let y = size.value.height - 1; y >= 0; y--) {
    const tilesInRow = getMatrixRow(tilesMatrix.value, y)
      .filter(Boolean)
      .filter(tile => !tile.static)

    // Prioritize tiles over ramps
    tilesInRow.sort((a, b) => {
      const tileUnder = tile => getMatrixCell(tilesMatrix.value, { x: tile.position.x, y: tile.position.y + 1 })
      return isRamp(tileUnder(b)) - isRamp(tileUnder(a))
    })

    tilesInRow.forEach(tile => {
      const currentPosition = { ...tile.position }
      const waypoints = [currentPosition, ...computeFalldownPath(tile.position, matrix)]
      const newPosition = waypoints.slice(-1).pop()
      const updatedTile = { ...tile, position: newPosition }

      setMatrixCell(matrix, newPosition, updatedTile)

      movements[tile.id] = {
        tile: updatedTile,
        waypoints
      }
    })
  }

  tiles.value = tiles.value.map(tile => movements[tile.id]?.tile || tile)

  return Object.values(movements)
}

const fillWithDots = (colors: DotColors[]) => {
  const { width, height } = size.value

  let emptySlots = []

  for (let x = 0; x < width; x++) {
    let emptySlotsInColumn = []

    for (let y = 0; y < height; y++) {
      const tile = getMatrixCell(tilesMatrix.value, { x, y })

      if (!tile) {
        emptySlotsInColumn.push({
          position: { x, y },
          newTile: undefined,
          initialOffset: 0
        })
      }
    }

    emptySlotsInColumn.forEach((slot, index, { length }) => {
      slot.initialOffset = slot.position.y + (length - index)
    })

    emptySlots = emptySlots.concat(emptySlotsInColumn)
  }

  // Anchors

  if (goals.value.some(goal => isAnchor(goal.tile))) {
    const numberOfCurrentAnchors = tiles.value.filter(isAnchor).length
    const anchorsLimit = props.level.anchors?.maximum ?? Math.ceil(width * height / 16)
    const numberOfNewAnchors = Math.floor(Math.random() * (anchorsLimit - numberOfCurrentAnchors + 1))

    for (let i = 0; i < numberOfNewAnchors; i++) {
      const availableSlots = emptySlots
        .filter(slot => !slot.newTile && !slot.position.y)
        .filter(slot => props.level.anchors?.dedicatedColumns ? props.level.anchors?.dedicatedColumns.includes(slot.position.x) : true)

      const slot = getRandomItem(availableSlots)

      if (slot) {
        slot.newTile = createAnchorTile(slot.position)
      }
    }
  }

  // Dots

  emptySlots.forEach(slot => {
    slot.newTile = slot.newTile || createDotTile(slot.position, colors)
  })

  const newTiles = emptySlots.map(({ newTile }) => newTile)

  tiles.value = tiles.value.concat(newTiles)

  // Compute movements

  const movements = emptySlots.map(emptySlot => {
    const waypoints = [...Array(emptySlot.initialOffset + 1)].map((_, index) => ({
      x: emptySlot.newTile.position.x,
      y: emptySlot.newTile.position.y - emptySlot.initialOffset + index
    }))

    return {
      tile: emptySlot.newTile,
      waypoints
    }
  })

  return movements
}

const convertIntoBomb = (tile: Tile) => {
  const bomb = createBombTile(tile.position, tile)

  popTiles([tile])
  tiles.value.push(bomb)
}

const accountTiles = (tiles: Tile[]) => {
  gainScore(sumTilesScorePoinst(tiles))

  goals.value = goals.value.map(goal => {
    if (goal.tile) {
      const numberOfTiles = tiles.filter(tile => {
        if (isDot(goal?.tile)) {
          return goal.tile.color === tile.color
        }

        return goal?.tile.type === tile.type
      }).length

      return { ...goal, current: Math.min(goal.target, goal.current + numberOfTiles) }
    }

    return goal
  })
}

const accountBrokenIceModifiers = (iceModifiers: IceModifier[]) => {
  goals.value = goals.value.map(goal => {
    if (isIce(goal.modifier)) {
      return { ...goal, current: Math.min(goal.target, goal.current + iceModifiers.length) }
    }

    return goal
  })
}

const gainScore = (points: number) => {
  score.value += points
}

const getAllDotTilesOfColor = (color: DotColors) => {
  return tiles.value
    .filter(isDot)
    .filter(tile => tile.color === color)
}

const getTileComponent = (tile: Tile) => {
  return tileComponentRefs.value[tile.id] // $refs[tile.id][0]
}

const getModifierComponent = (modifier: Modifier) => {
  return modifierComponentRefs.value[modifier.id] //[0]
}

const getTileContentComponent = (tile: Tile) => {
  return getTileComponent(tile).$refs.content
}

const getModifierContentComponent = (modifier: Modifier) => {
  return getModifierComponent(modifier).$refs.content
}

const completeLevel = async () => {
  await sleep(150)

  // this.$store.dispatch('completeLevel', {
  //   level: this.level.id,
  //   score: this.score
  // })

  modal.open(SuccessModal)
    .then(() => router.push({ name: 'map' }))

  AudioService.playVictoryThumb()
}

const outOfMoves = async () => {
  await sleep(150)

  modal.open(OutOfMovesModal)
    .then(() => router.push({ name: 'map' }))

  AudioService.playNoMoreMovesThumb()
}

const restartLevel = async () => {
  await sleep(300)

  restart()
}

const exitToMap = async () => {
  await sleep(150)
  await animateTiles(tiles.value, c => c.animateDestruction(), getTileComponent)
  await sleep(150)

  router.push({ name: 'map' })
}

onMounted(() => {
  restart()
})

onBeforeUnmount(() => {
  cancelSquaresHighlighting()
})

const createRef = <T = unknown>(listRef: Record<string, T>, id: string) => (c: T) => { listRef[id] = c }
</script>

<template>
  <div class="LevelView flex flex-col items-center justify-center px-3 lg:px-5"
    :style="{ background: level.theme.background }">
    <LevelInterface :moves-left="movesLeft" :goals="goals" :theme="level.theme" :score="score"
      @restart-level="restartLevel()" @exit-to-map="exitToMap()" />

    <!-- canvas -->
    <svg :width="canvasSize.width" :height="canvasSize.height" :viewBox="`0 0 ${size.width} ${size.height}`"
      class="mx-auto" ref="canvasRef">

      <!-- walls -->
      <WallsLayer :walls="wallTiles" :size="size" />

      <!-- tiles -->
      <svg v-for="tile in tiles" v-bind="tile.position" :key="tile.id">
        <GameboardTile :tile="tile" :ref="(c) => tileComponentRefs[tile.id] = (c as ComponentPublicInstance)"
          :theme="level.theme" />
      </svg>

      <!-- Modifiers -->
      <GameboardModifier v-for="modifier in modifiersWithTile" v-bind="modifier.position"
        :ref="(c) => modifierComponentRefs[modifier.id] = (c as ComponentPublicInstance)" :key="modifier.id"
        :modifier="modifier" :theme="level.theme" />

      <Selection :tiles-matrix="tilesMatrix" :disabled="isSelectionDisabled" :theme="level.theme" :size="size"
        @start="startSelection" @change="changeSelection" @end="endSelection" />
    </svg>

    <!-- frame -->
    <SelectionProgressFrame :selection="isMakingSelection ? selection : []" :theme="level.theme" />
  </div>
</template>

<style lang="postcss">
.LevelView {
  touch-action: none;
}

.LevelView svg {
  overflow: visible;
}
</style>