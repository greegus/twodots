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
      ref="tileCanvas"
    >

      <!-- walls -->
      <WallsLayer
        :walls="wallTiles"
        :size="size"
      />

      <!-- tiles -->
      <svg v-for="tile in tiles" :key="tile.id" :x="tile.x" :y="tile.y">
        <GameboardTile
          :tile="tile"
          :ref="`tile.${tile.id}`"
          :theme="level.theme"
          @pointerdown.native="startSelection(tile)"
          @gotpointercapture.native="releasePointerCapture"
        />
      </svg>

      <!-- ice modifiers -->
      <IceModifiersLayer
        :modifiers="iceModifiers"
        :theme="level.theme"
      />

      <!-- selection line -->
      <SelectionLine
        :selection="selection"
        :theme="level.theme"
        :size="size"
        v-if="isMakingSelection"
      />

      <!-- selection zones -->
      <g v-if="isMakingSelection" class="relative z-1 opacity-0">
        <svg v-for="tile in nextPossibleTiles" :key="tile.id" :x="tile.x" :y="tile.y">
          <rect width="1" height="1" @pointerenter="addToSelection(tile, $event)" />
        </svg>

        <svg v-if="secondLastSelected" :x="secondLastSelected.x" :y="secondLastSelected.y">
          <rect width="1" height="1" @pointerenter="removeLastFromSelection($event)" />
        </svg>
      </g>
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

import { isSelectionClosed, getTilesEnclosedBySelection } from 'utils/selection'
import { generateBombTile, generateDotTile, generateAnchorTile, isDot, isBomb, isWall, isRamp, isAnchor } from 'utils/tileGenerator'
import { isIce } from 'utils/modifierGenerator'
import { getNeighbourTiles, PATTERN_DOWN_SQUARE, PATTERN_SQUARE } from 'utils/tilesFinder'
import { getRandomItem } from 'utils/array'
import { generateGameboard } from 'utils/gameboard'
import { createMatrix, getMatrixCell, getMatrixRow, setMatrixCell } from 'utils/matrix'

import * as AudioService from 'services/AudioService'

import LevelInterface from 'components/LevelInterface'

import GameboardTile from 'components/canvas/GameboardTile'
import SelectionLine from 'components/canvas/SelectionLine'
import SelectionProgressFrame from 'components/canvas/SelectionProgressFrame'
import WallsLayer from 'components/canvas/WallsLayer'
import IceModifiersLayer from 'components/canvas/IceModifiersLayer'

import SuccessModal from 'modals/SuccessModal'
import OutOfMovesModal from 'modals/OutOfMovesModal'

const isSamePosition = (a, b) => a.x === b.x && a.y === b.y
const hasId = id => item => item.id === id
const hasPosition = position => item => isSamePosition(item.position, position)

function getInitialState(level) {
  return {
    ...generateGameboard(level.blueprint, level.colors),
    movesLeft: level.moves,
    goals: level.goals.map(goal => ({ ...goal, current: 0 })),
    score: 0,
    isSelectionAllowed: true
  }
}

function getNextPossibleTiles(tile, tiles, lastSelected = undefined) {
  return getNeighbourTiles(tile, tiles)
    .filter(isDot)
    .filter(({ color }) => tile.color === color)
    .filter(({ id }) => (lastSelected ? lastSelected.id !== id : true))
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
    WallsLayer,
    IceModifiersLayer,
    SelectionLine,
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
      isSelectionAllowed: true,

      selection: [],
      isMakingSelection: false,
      nextPossibleTiles: [],
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

      this.tiles.forEach(tile => setMatrixCell(matrix, tile, tile))

      return matrix
    },

    wallTiles() {
      return this.tiles.filter(isWall)
    },

    iceModifiers() {
      return this.modifiers.filter(isIce).map(modifier => ({
        ...modifier, tile: getMatrixCell(this.tilesMatrix, modifier.position)
      }))
    },

    selectionColor() {
      return this.selection.length && this.selection[0].color || undefined
    },

    isSelectionClosed() {
      return isSelectionClosed(this.selection)
    },

    lastSelected() {
      return this.selection[this.selection.length - 1]
    },

    secondLastSelected() {
      return this.selection[this.selection.length - 2]
    },

    availableDotSquares() {
      return this.tiles
        .filter(isDot)
        .reduce((squares, tile) => {
          const squareTiles = getNeighbourTiles(tile, this.tiles, PATTERN_DOWN_SQUARE)
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

    releasePointerCapture(e) {
      e.target.releasePointerCapture(e.pointerId)
    },

    startSelection(tile) {
      if (!this.isSelectionAllowed || !isDot(tile)) {
        return
      }

      this.isMakingSelection = true
      this.selection = []

      this.cancelSquaresHighlighting()
      this.addToSelection(tile)

      window.addEventListener('pointerup', this.endSelection)
    },

    addToSelection(tile) {
      this.selection.push(tile)

      const selectedWithoutLast = this.selection.slice(0, this.selection.length - 2)

      if (this.isSelectionClosed) {
        this.getAllDotTilesOfColor(this.selectionColor)
          .map(this.getTileContentComponent)
          .forEach(c => c.animateBeacon())
      }

      this.getTileContentComponent(tile).animateBeacon()
      this.playSelectionThumb()

      if (selectedWithoutLast.some(hasId(this.lastSelected.id))) {
        this.nextPossibleTiles = []
        return
      }

      const nextPossibleTiles = getNextPossibleTiles(
        tile,
        this.tiles,
        this.lastSelected
      )

      this.nextPossibleTiles = nextPossibleTiles
    },

    removeLastFromSelection(e) {
      e.preventDefault()

      this.selection.pop()

      const leadingTile = this.selection.slice(-1).pop()

      this.getTileContentComponent(leadingTile).animateBeacon()
      this.playSelectionThumb()

      this.nextPossibleTiles = getNextPossibleTiles(
        this.lastSelected,
        this.tiles,
        this.secondLastSelected
      )
    },

    playSelectionThumb() {
      if (this.isSelectionClosed) {
        AudioService.playClosedSelectionThumb(this.selection.length)
      } else if (this.selection.length) {
        AudioService.playSelectionThumb(this.selection.length)
      }
    },

    async endSelection(e) {
      e.preventDefault()

      window.removeEventListener('pointerup', this.endSelection)

      this.isMakingSelection = false
      this.isSelectionAllowed = false
      this.nextPossibleTiles = []

      if (this.selection.length > 1) {
        this.movesLeft = this.movesLeft - 1

        if (this.isSelectionClosed) {
          getTilesEnclosedBySelection(this.tiles, this.selection)
            .filter(tile => !tile.static)
            .forEach(this.convertIntoBomb)
        }

        const tilesToPop = this.isSelectionClosed
          ? this.getAllDotTilesOfColor(this.selectionColor)
          : this.selection

        await this.poppingRoutine(tilesToPop, this.isSelectionClosed && this.selectionColor)
      }

      this.selection = []

      if (this.hasMetGoals) {
        return this.completeLevel()
      }

      if (!this.hasMovesLeft) {
        return this.outOfMoves()
      }

      this.initSquaresHighlighting()

      this.isSelectionAllowed = true
    },

    async poppingRoutine(tilesToPop, restrictedColor = undefined) {
        // pop tiles

        const availableColors = restrictedColor
          ? this.level.colors.filter(color => color !== restrictedColor)
          : this.level.colors

        const movements = []

        await this.popTiles(tilesToPop)

        movements.push(...this.fallDown())
        movements.push(...this.fillWithDots(availableColors))

        await this.animateMovements(movements)

        // bombs
        const bombs = this.tiles.filter(isBomb)

        if (bombs.length) {
          const tilesToPopByBomb = bombs.reduce((acc, bomb) => {
            const tiles = getNeighbourTiles(bomb, this.tiles, PATTERN_SQUARE)
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
        .map(tile => this.modifiers.find(hasPosition(tile)))
        .filter(Boolean)

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
        setMatrixCell(matrix, tile, tile)
      })

      const movements = {}

      // Start from bottom to top, row by row
      for (let y = this.size.height - 1; y >= 0; y--) {
        const tilesInRow = getMatrixRow(this.tilesMatrix, y)
          .filter(Boolean)
          .filter(tile => !tile.static)

        // Prioritize tiles over ramps
        tilesInRow.sort((a, b) => {
          const tileUnder = tile => getMatrixCell(this.tilesMatrix, {x: tile.x, y: tile.y + 1})
          return isRamp(tileUnder(b)) - isRamp(tileUnder(a))
        })

        tilesInRow.forEach(tile => {
          const currentPosition = { x: tile.x, y: tile.y }
          const waypoints = [currentPosition, ...computeFalldownPath(tile, matrix)]
          const newPosition = waypoints.slice(-1).pop()
          const updatedTile = { ...tile, ...newPosition }

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
          const tile = this.tilesMatrix[y][x]

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
            slot.newTile = generateAnchorTile(slot.position)
          }
        }
      }

      // Dots

      emptySlots.forEach(slot => {
        slot.newTile = slot.newTile || generateDotTile(slot.position, colors)
      })

      const newTiles = emptySlots.map(({ newTile }) => newTile)

      this.tiles = this.tiles.concat(newTiles)

      // Compute movements

      const movements = emptySlots.map(emptySlot => {
        const waypoints = [...Array(emptySlot.initialOffset + 1)].map((_, index) => ({
          x: emptySlot.newTile.x,
          y: emptySlot.newTile.y - emptySlot.initialOffset + index
        }))

        return {
          tile: emptySlot.newTile,
          waypoints
        }
      })

      return movements
    },

    convertIntoBomb(tile) {
      this.popTiles([tile])

      const { x, y } = tile

      this.tiles.push(generateBombTile({ x, y }, tile))
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
      return this.$refs[`tile.${tile.id}`][0]
    },

    getTileContentComponent(tile) {
      return this.getTileComponent(tile).$refs.content
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