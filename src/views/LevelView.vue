<template>
  <div class="LevelView flex flex-col items-center justify-center px-3 lg:px-5" :style="{ background: level.theme.background }">
    <LevelInterface
      :moves-left="movesLeft"
      :goals="goals"
      :theme="level.theme"
      :score="score"
      @restart-level="restartLevel()"
      @exit-to-map="exitToMap()"
    />

    <!-- canvas -->
    <svg
      :width="canvasSize.width"
      :height="canvasSize.height"
      :viewBox="`0 0 ${size.width} ${size.height}`"
      class="mx-auto"
      ref="canvas"
    >

      <!-- walls -->
      <WallsLayer
        :walls="wallTiles"
        :size="size"
      />

      <!-- tiles -->
      <svg v-for="tile in tiles" v-bind="tile.position" :key="tile.id">
        <GameboardTile
          :tile="tile"
          :ref="tile.id"
          :theme="level.theme"
        />
      </svg>

      <!-- Modifiers -->
      <GameboardModifier
        v-for="modifier in modifiersWithTile"
        v-bind="modifier.position"
        :ref="modifier.id"
        :key="modifier.id"
        :modifier="modifier"
        :theme="level.theme"
      />

      <Selection
        :tiles-matrix="tilesMatrix"
        :disabled="isSelectionDisabled"
        :theme="level.theme"
        :size="size"
        @start="startSelection"
        @change="changeSelection"
        @end="endSelection"
      />
    </svg>

    <!-- frame -->
    <SelectionProgressFrame
      :selection="isMakingSelection ? selection : []"
      :theme="level.theme"
    />
  </div>
</template>

<script>
import config from 'config'

import { createBombTile, createDotTile, createAnchorTile, isDot, isBomb, isWall, isRamp, isAnchor } from 'utils/tiles'
import { isIce } from 'utils/modifiers'
import { getRandomItem } from 'utils/array'
import { generateGameboard } from 'utils/gameboard'
import { createMatrix, getMatrixCell, getMatrixRow, setMatrixCell, getNeighbourCells, patterns } from 'utils/matrix'
import { animateSparks } from 'utils/effects'
import { hasId, hasPosition } from 'utils/helpers'

import * as AudioService from 'services/AudioService'

import LevelInterface from 'components/LevelInterface'

import GameboardTile from 'components/canvas/GameboardTile'
import GameboardModifier from 'components/canvas/GameboardModifier'
import SelectionProgressFrame from 'components/canvas/SelectionProgressFrame'
import WallsLayer from 'components/canvas/WallsLayer'
import Selection from 'components/canvas/Selection'

import SuccessModal from 'modals/SuccessModal'
import OutOfMovesModal from 'modals/OutOfMovesModal'

function getInitialState(level) {
  return {
    ...generateGameboard(level.blueprint, level.colors),
    movesLeft: level.moves,
    goals: level.goals.map(goal => ({ ...goal, current: 0 })),
    score: 0,
    isSelectionDisabled: false
  }
}

function sumTilesScorePoinst(tiles) {
  return tiles.reduce((sum, tile) => {
    return sum + (tile.value || 1)
  }, 0)
}

async function sleep(time) {
  await new Promise(resolve => setTimeout(resolve, time))
}

export default {
  components: {
    LevelInterface,
    GameboardTile,
    GameboardModifier,
    WallsLayer,
    Selection,
    SelectionProgressFrame,
  },

  props: {
    level: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      size: { width: 0, height: 0 },
      tiles: [],
      modifiers: [],
      movesLeft: 0,
      goals: [],
      score: 0,

      selection: [],
      isMakingSelection: false,
      isSelectionDisabled: false
    }
  },

  computed: {
    canvasSize() {
      return {
        width: `${this.size.width / config.gameboardSize.width * 100}%`,
        height: `${this.size.height * config.tileSize}px`
      }
    },

    tilesMatrix() {
      const matrix = createMatrix(this.size)

      this.tiles.forEach(tile => setMatrixCell(matrix, tile.position, tile))

      return matrix
    },

    wallTiles() {
      return this.tiles.filter(isWall)
    },

    modifiersWithTile() {
      return this.modifiers.map(modifier => ({
        ...modifier, tile: getMatrixCell(this.tilesMatrix, modifier.position)
      }))
    },

    availableDotSquares() {
      return this.tiles
        .filter(isDot)
        .reduce((squares, tile) => {
          const squareTiles = getNeighbourCells(this.tilesMatrix, tile.position, patterns.DOWN_SQUARE)
          const hasSameColor = squareTiles.every(tileInSquare => tileInSquare?.color === tile.color)

          if (hasSameColor && squareTiles.length === 4) {
            squares.push(squareTiles)
          }

          return squares
        }, [])
    },

    hasAnyHorizontalMove() {
      return this.tilesMatrix.some(row => {
        return row.some((tile, index, tiles) => {
          const nextTile = tiles[index + 1]
          return nextTile?.color === tile.color
        })
      })
    },

    hasAnyVerticalMove() {
      return this.tilesMatrix.some((row, rowIndex, rows) => {
        return row.some((tile, index) => {
          const nextRow = rows[rowIndex + 1]
          const nextTile = nextRow && nextRow[index]
          return nextTile?.color === tile.color
        })
      })
    },

    hasAnyMoveAvailable() {
      return this.hasAnyHorizontalMove || this.hasAnyVerticalMove
    },

    hasMetGoals() {
      return this.goals.every(goal => {
        return goal.current >= goal.target
      })
    },

    isLowOnMovesLeft() {
      return this.movesLeft <= 5
    },

    hasMovesLeft() {
      return this.movesLeft > 0
    }
  },

  methods: {
    restart() {
      Object.entries(getInitialState(this.level)).forEach(([ key, value ]) => {
        this.$set(this, key, value)
      })

      this.cancelSquaresHighlighting()
      this.initSquaresHighlighting()
    },

    initSquaresHighlighting() {
      this.squaresHighlightingInterval = setInterval(() => this.highlightRandomSquare(), 10000)
    },

    cancelSquaresHighlighting() {
      this.squaresHighlightingInterval && clearInterval(this.squaresHighlightingInterval)
    },

    startSelection() {
      this.isMakingSelection = true
      this.cancelSquaresHighlighting()
    },

    changeSelection({ selection, isSelectionClosed, selectionColor, lastSelected }) {
      this.selection = selection

      if (isSelectionClosed) {
        this.getAllDotTilesOfColor(selectionColor)
          .map(this.getTileContentComponent)
          .forEach(c => c.animateBeacon())
      }

      if (lastSelected) {
        this.getTileContentComponent(lastSelected).animateBeacon()
      }
    },

    async endSelection({ selection, enclosedTiles, isSelectionClosed, selectionColor }) {
      this.selection = []

      if (selection.length > 1) {
        this.movesLeft = this.movesLeft - 1

        if (isSelectionClosed) {
          enclosedTiles.filter(tile => !tile.static).forEach(this.convertIntoBomb)
        }

        const tilesToPop = isSelectionClosed
          ? this.getAllDotTilesOfColor(selectionColor)
          : selection

        await this.poppingRoutine(tilesToPop, isSelectionClosed && selectionColor)
      }

      if (this.hasMetGoals) {
        return this.completeLevel()
      }

      if (!this.hasMovesLeft) {
        return this.outOfMoves()
      }

      this.initSquaresHighlighting()

      this.isSelectionDisabled = false
    },

    async poppingRoutine(tilesToPop, restrictedColor = undefined) {
      // pop tiles

      let availableColors = restrictedColor
        ? this.level.colors.filter(color => color !== restrictedColor)
        : this.level.colors

      if (!availableColors.length) {
        availableColors = this.level.colors
      }

      const movements = []

      await this.popTiles(tilesToPop)

      movements.push(...this.fallDown())
      movements.push(...this.fillWithDots(availableColors))

      await this.animateMovements(movements)

      // bombs
      const bombs = this.tiles.filter(isBomb)

      if (bombs.length) {
        const tilesToPopByBomb = bombs.reduce((acc, bomb) => {
          const tiles = getNeighbourCells(this.tilesMatrix, bomb.position, patterns.SQUARE)
            .filter(tile => !tile.static)

          return acc.concat({ bomb, tiles })
        }, [])

        const tilesToPop = tilesToPopByBomb.flatMap(({ tiles }) => tiles)

        this.animateTiles(tilesToPop, ref => ref.animateBurn())

        const detonationAnimations = tilesToPopByBomb.map(
          ({ bomb, tiles }) => this.animateTiles(bomb, ref => ref.animateDetonation(tiles))
        )

        await Promise.all(detonationAnimations)

        return this.poppingRoutine(tilesToPop.concat(bombs))
      }

      // anchors
      const sunkenAnchors = this.tiles
        .filter(isAnchor)
        .filter(tile => tile.y + 1 === this.size.height)

      if (sunkenAnchors.length) {
        return this.poppingRoutine(sunkenAnchors)
      }
    },

    async animateMovements(movements) {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          const animations = movements
            .filter(({ waypoints }) => waypoints.length > 1)
            .map(({ tile, waypoints }) => this.getTileComponent(tile).animateFall(waypoints))

          Promise.all(animations).then(resolve)
        })
      })
    },

    async animateTiles(tiles, animationMapper, refMapper = this.getTileContentComponent) {
      return Promise.all([].concat(tiles).map(tile => animationMapper(refMapper(tile))))
    },

    async popTiles(tilesToPop) {
      await sleep(150)

      this.crackTheIce(tilesToPop)
      this.accountTiles(tilesToPop)

      await this.animateTiles(tilesToPop, c => c.animateDestruction(), this.getTileComponent)

      this.tiles = this.tiles.filter(tile => !tilesToPop.some(hasId(tile.id)))
    },

    async crackTheIce(tilesToPop) {
      const icesToCrack = tilesToPop
        .map(tile => this.modifiers.find(hasPosition(tile.position)))
        .filter(Boolean)

      icesToCrack
        .forEach(ice => animateSparks(this.$refs.canvas, ice.position))

      this.modifiers = this.modifiers
        .map(modifier => icesToCrack.some(hasId(modifier.id))
          ? { ...modifier, cracks: (modifier.cracks || 0) + 1 }
          : modifier
        )

      const icesToBreak = this.modifiers
        .filter(isIce).filter(ice => ice.cracks > 2)

      this.modifiers = this.modifiers
        .filter(modifier => !icesToBreak.some(hasId(modifier.id)))

      this.accountBrokenIceModifiers(icesToBreak)
    },

    fallDown() {
      const computeFalldownPath = ({ x, y }, matrix) => {
        const cursor = { x, y }
        const waypoints = []

        while (++cursor.y < matrix.length) {
          const tile = getMatrixCell(matrix, cursor)

          if (!tile) {
            waypoints.push({...cursor})
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

      const matrix = createMatrix(this.size)

      this.tiles.filter(tile => tile.static).forEach(tile => {
        setMatrixCell(matrix, tile.position, tile)
      })

      const movements = {}

      // Start from bottom to top, row by row
      for (let y = this.size.height - 1; y >= 0; y--) {
        const tilesInRow = getMatrixRow(this.tilesMatrix, y)
          .filter(Boolean)
          .filter(tile => !tile.static)

        // Prioritize tiles over ramps
        tilesInRow.sort((a, b) => {
          const tileUnder = tile => getMatrixCell(this.tilesMatrix, { x: tile.position.x, y: tile.position.y + 1 })
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

      this.tiles = this.tiles.map(tile => movements[tile.id]?.tile || tile)

      return Object.values(movements)
    },

    fillWithDots(colors) {
      const { width, height } = this.size

      let emptySlots = []

      for (let x = 0; x < width; x++) {
        let emptySlotsInColumn = []

        for (let y = 0; y < height; y++) {
          const tile = getMatrixCell(this.tilesMatrix, { x, y })

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

      if (this.goals.some(goal => isAnchor(goal.tile))) {
        const numberOfCurrentAnchors = this.tiles.filter(isAnchor).length
        const anchorsLimit = this.level.anchors?.maximum ?? Math.ceil(this.size.width * this.size.height / 16)
        const numberOfNewAnchors = Math.floor(Math.random() * (anchorsLimit - numberOfCurrentAnchors + 1))

        for (let i = 0; i < numberOfNewAnchors; i++) {
          const availableSlots = emptySlots
            .filter(slot => !slot.newTile && !slot.position.y)
            .filter(slot => this.level.anchors?.dedicatedColumns ? this.level.anchors?.dedicatedColumns.includes(slot.position.x) : true )

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

      this.tiles = this.tiles.concat(newTiles)

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
    },

    convertIntoBomb(tile) {
      const bomb = createBombTile(tile.position, tile)

      this.popTiles([tile])
      this.tiles.push(bomb)
    },

    highlightRandomSquare() {
      if (this.availableDotSquares.length) {
        this.animateTiles(getRandomItem(this.availableDotSquares), ref => ref.animateBeacon())
      }
    },

    accountTiles(tiles) {
      this.gainScore(sumTilesScorePoinst(tiles))

      this.goals = this.goals.map(goal => {
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
    },

    accountBrokenIceModifiers(iceModifiers) {
      this.goals = this.goals.map(goal => {
        if (isIce(goal.modifier)) {
          return { ...goal, current: Math.min(goal.target, goal.current + iceModifiers.length) }
        }

        return goal
      })
    },

    gainScore(points) {
      this.score = this.score + points
    },

    getAllDotTilesOfColor(color) {
      return this.tiles
        .filter(isDot)
        .filter(tile => tile.color === color)
    },

    getTileComponent(tile) {
      return this.$refs[tile.id][0]
    },

    getModifierComponent(modifier) {
      return this.$refs[modifier.id][0]
    },

    getTileContentComponent(tile) {
      return this.getTileComponent(tile).$refs.content
    },

    getModifierContentComponent(modifier) {
      return this.getModifierComponent(modifier).$refs.content
    },

    async completeLevel() {
      await sleep(150)

      this.$store.dispatch('completeLevel', {
        level: this.level.id,
        score: this.score
      })

      this.$modal(SuccessModal)
        .then(() => this.$router.push({ name: 'map' }))

      AudioService.playVictoryThumb()
    },

    async outOfMoves() {
      await sleep(150)

      this.$modal(OutOfMovesModal)
        .then(() => this.$router.push({ name: 'map' }))

      AudioService.playNoMoreMovesThumb()
    },

    async restartLevel() {
      await sleep(300)

      this.restart()
    },

    async exitToMap() {
      await sleep(150)
      await this.animateTiles(this.tiles, c => c.animateDestruction(), this.getTileComponent)
      await sleep(150)

      this.$router.push({ name: 'map' })
    }
  },

  created() {
    this.restart()
  },

  beforeDestroy() {
    this.cancelSquaresHighlighting()
  }
}
</script>

<style lang="postcss">
.LevelView {
  touch-action: none;
}

.LevelView svg {
  overflow: visible;
}
</style>