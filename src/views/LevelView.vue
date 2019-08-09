<template>
  <div class="LevelView flex flex-col items-center justify-center">
    <div class="absolute top-0 flex align-center text-gray-700 mt-12">
      <div class="LevelView__panel px-0 w-16 mr-5">
        <div class="text-center leading-none">
          <div class="text-2xl mb-1">{{ movesLeft }}</div>
          <div class="uppercase text-xs font-normal">Moves</div>
        </div>
      </div>

      <div class="LevelView__panel px-5">
        <div v-for="(goal, $index) in goals" :key="$index">
          <GoalItem :goal="goal" show-current small />
        </div>
      </div>

      <div class="LevelView__panel px-0 w-16 ml-5 cursor-pointer" @click="quitLevel()">
        <Icon name="map" size="lg" />
      </div>
    </div>

    <div class="absolute bottom-0 text-gray-700 mb-12">
      <div class="LevelView__panel w-32">
        <div class="text-center leading-none">
          <div class="uppercase text-xs font-normal mb-1">Score</div>
          <div class="text-2xl">{{ score }}</div>
        </div>
      </div>
    </div>

    <!-- canvas -->
    <svg
      :width="realSize.width"
      :height="realSize.height"
      :viewBox="`0 0 ${size.width} ${size.height}`"
      class="mx-auto"
      ref="tileCanvas"
    >

      <!-- tiles -->
      <g>
        <svg v-for="tile in tiles" :key="tile.id" :x="tile.x" :y="tile.y">
          <MapTile :tile="tile" :ref="`tile.${tile.id}`" @mousedown.native="startSelection(tile, $event)" />
        </svg>
      </g>

      <!-- selection line -->
      <SelectionLine
        :selection="selection"
        :is-active="isMakingSelection"
      />

      <!-- selection zones -->
      <g v-if="isMakingSelection" class="relative z-1 opacity-0">
        <svg v-for="tile in nextPossibleTiles" :key="tile.id" :x="tile.x" :y="tile.y">
          <rect width="1" height="1" @mouseenter="addToSelection(tile)" />
        </svg>

        <svg v-if="secondLastSelected" :x="secondLastSelected.x" :y="secondLastSelected.y">
          <rect width="1" height="1" @mouseenter="removeLastFromSelection()" />
        </svg>
      </g>
    </svg>

    <!-- frame -->
    <SelectionProgressFrame
      :selection="isMakingSelection ? selection : []"
    />
  </div>
</template>

<script>
import config from 'config'

import { isSelectionClosed, getTilesEnclosedBySelection } from 'utils/selection'
import { generateBombTile, generateDotTile, generateAnchorTile, isDot, isBomb, isWall, isAnchor } from 'utils/tileGenerator'
import { getNeighbourTiles, PATTERN_DOWN_SQUARE, PATTERN_SQUARE } from 'utils/tilesFinder'
import { getRandomItem } from 'utils/array'
import { generateMap } from 'utils/map'

import GoalItem from 'components/GoalItem'
import Icon from 'components/Icon'

import MapTile from 'components/canvas/MapTile'
import SelectionLine from 'components/canvas/SelectionLine'
import SelectionProgressFrame from 'components/canvas/SelectionProgressFrame'

import SuccessModal from 'modals/SuccessModal';
import OutOfMovesModal from 'modals/OutOfMovesModal';
import { Promise } from 'q';

function getInitialState(level) {
  return {
    ...generateMap(level.blueprint, level.colors),
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
    .filter(({ id }) => (lastSelected ? lastSelected.id !== id : true));
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
  name: 'LevelView',

  components: {
    SelectionProgressFrame,
    SelectionLine,
    GoalItem,
    Icon,

    MapTile
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
      movesLeft: 0,
      goals: [],
      score: 0,
      isSelectionAllowed: true,

      selection: [],
      isMakingSelection: false,
      nextPossibleTiles: [],
    };
  },

  computed: {
    realSize() {
      return {
        width: this.size.width * config.tileSize,
        height: this.size.height * config.tileSize
      };
    },

    tilesMatrix() {
      const matrix = Array.from({ length: this.size.height }).map(() => {
        return Array.from({ from: this.size.width })
      })

      this.tiles.forEach(tile => matrix[tile.y][tile.x] = tile)

      return matrix
    },

    selectionColor() {
      return this.selection.length && this.selection[0].color || undefined;
    },

    isSelectionClosed() {
      return isSelectionClosed(this.selection)
    },

    lastSelected() {
      return this.selection[this.selection.length - 1];
    },

    secondLastSelected() {
      return this.selection[this.selection.length - 2];
    },

    availableDotSquares() {
      return this.tiles
        .filter(isDot)
        .reduce((squares, tile) => {
          const squareTiles = getNeighbourTiles(tile, this.tiles, PATTERN_DOWN_SQUARE)
          const hasSameColor = squareTiles.every(tileInSquare => tileInSquare && tileInSquare.color === tile.color)

          if (hasSameColor && squareTiles.length === 4) {
            squares.push(squareTiles)
          }

          return squares
        }, [])
    },

    hasAnyHorizontalMove() {
      return this.tilesMatrix.some(row => {
        return row.some((tile, index, tiles) => {
          const nextTile = tiles[index + 1];
          return nextTile && nextTile.color === tile.color;
        });
      });
    },

    hasAnyVerticalMove() {
      return this.tilesMatrix.some((row, rowIndex, rows) => {
        return row.some((tile, index) => {
          const nextRow = rows[rowIndex + 1];
          const nextTile = nextRow && nextRow[index];
          return nextTile && nextTile.color === tile.color;
        });
      });
    },

    hasAnyMoveAvailable() {
      return this.hasAnyHorizontalMove || this.hasAnyVerticalMove;
    },

    hasMetGoals() {
      return this.goals.every(goal => {
        return goal.current >= goal.target
      })
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

    startSelection(tile) {
      if (!this.isSelectionAllowed || !isDot(tile)) {
        return
      }

      this.isMakingSelection = true;
      this.selection = []

      this.cancelSquaresHighlighting()
      this.addToSelection(tile)

      window.addEventListener('mouseup', this.endSelection);
    },

    addToSelection(tile) {
      this.selection.push(tile);

      this.getTileContentComponent(tile).animateBeacon()

      const selectedWithoutLast = this.selection.slice(
        0,
        this.selection.length - 2
      );

      if (this.isSelectionClosed) {
        this.getAllDotTilesOfColor(this.selectionColor)
          .map(this.getTileContentComponent)
          .forEach(c => c.animateBeacon())
      }

      if (selectedWithoutLast.some(({ id }) => id === this.lastSelected.id)) {
        this.nextPossibleTiles = [];
        return;
      }

      const nextPossibleTiles = getNextPossibleTiles(
        tile,
        this.tiles,
        this.lastSelected
      );

      this.nextPossibleTiles = nextPossibleTiles;
    },

    removeLastFromSelection() {
      this.selection.pop();

      this.nextPossibleTiles = getNextPossibleTiles(
        this.lastSelected,
        this.tiles,
        this.secondLastSelected
      );
    },

    async endSelection() {
      window.removeEventListener('mouseup', this.endSelection);

      this.isMakingSelection = false;
      this.isSelectionAllowed = false;
      this.nextPossibleTiles = [];

      if (this.selection.length > 1) {
        this.movesLeft = this.movesLeft - 1

        if (this.isSelectionClosed) {
          getTilesEnclosedBySelection(this.tiles, this.selection)
            .filter(isDot)
            .forEach(this.convertIntoBomb)
        }

        const tilesToPop = this.isSelectionClosed
          ? this.getAllDotTilesOfColor(this.selectionColor)
          : this.selection;

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
        const availableColors = restrictedColor
          ? this.level.colors.filter(color => color !== restrictedColor)
          : this.level.colors;

        await this.popTiles(tilesToPop);
        await this.fallDown();
        await this.fillWithDots(availableColors);

        // bombs
        const bombs = this.tiles.filter(isBomb)

        if (bombs.length) {
          const tilesToPopByBomb = bombs.reduce((acc, bomb) => {
            const tiles = getNeighbourTiles(bomb, this.tiles, PATTERN_SQUARE)
              .filter(isDot)

            return {
              ...acc,
              [bomb.id]: tiles
            }
          }, {})

          const tilesToPop = bombs.reduce((acc, bomb) => acc.concat(tilesToPopByBomb[bomb.id]), [])

          this.animateTiles(tilesToPop, ref => ref.animateBurn())

          await this.animateTiles(bombs, (ref, bomb) => ref.animateDetonation(tilesToPopByBomb[bomb.id]))

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

    async animateTiles(tiles, animationMapper, refMapper = this.getTileContentComponent) {
      return Promise.all([].concat(tiles).map(tile => animationMapper(refMapper(tile))))
    },

    async popTiles(tiles) {
      this.accountTiles(tiles)

      await this.animateTiles(tiles, c => c.animateDestruction(), this.getTileComponent)

      this.tiles = this.tiles.filter(tile => !tiles.some(({ id }) => id === tile.id));
    },

    async fallDown() {
      const { width, height } = this.size;
      const falls = {};

      for (let x = 0; x < width; x++) {
        const emptyTiles = []

        const column = this.tilesMatrix.map(row => row[x])

        for (let y = height - 1; y >= 0; y--) {
          const tile = column[y]

          if (!tile) {
            emptyTiles.push({ x, y })
            continue
          }

          if (!isWall(tile) && emptyTiles.length) {
            const newPosition = emptyTiles.shift()
            const depth = newPosition.y - tile.y

            falls[tile.id] = depth
            emptyTiles.push({ y: tile.y, x: tile.x })
          }
        }
      }

      this.tiles = this.tiles.map(tile => ({
        ...tile,
        y: tile.y + (falls[tile.id] || 0)
      }));

      this.$nextTick(() => {
        Object.entries(falls).forEach(([id, depth]) => {
          this.getTileComponent({ id }).animateFall(depth)
        })
      })
    },

    fillWithDots(colors) {
      const { width, height } = this.size;

      let emptySlots = [];

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

      // anchors

      if (this.goals.map(goal => goal.tile).some(isAnchor)) {
        const numberOfCurrentAnchors = this.tiles.filter(isAnchor).length
        const anchorsLimit = Math.ceil(this.size.width * this.size.height / 16)
        const numberOfNewAnchors = Math.floor(Math.random() * (anchorsLimit - numberOfCurrentAnchors + 1))

        console.log(numberOfNewAnchors)

        for (let i = 0; i < numberOfNewAnchors; i++) {
          const slot = getRandomItem(emptySlots.filter(slot => !slot.newTile && !slot.position.y));

          if (slot) {
            slot.newTile = generateAnchorTile(slot.position)
          }
        }
      }

      // dots

      emptySlots.forEach(slot => {
        slot.newTile = slot.newTile || generateDotTile(slot.position, colors)
      })

      const newTiles = emptySlots.map(({ newTile }) => newTile)

      this.tiles = this.tiles.concat(newTiles)

      return new Promise(resolve => {
        this.$nextTick(async () => {
          const animations = emptySlots.map(
            emptySlot => this.animateTiles(emptySlot.newTile, (ref) => ref.animateFall(emptySlot.initialOffset), this.getTileComponent)
          )

          Promise.all(animations).then(resolve)
        })
      })
    },

    convertIntoBomb(tile) {
      this.popTiles([tile])

      const { x, y } = tile

      this.tiles.push(generateBombTile({ x,y }, tile))
    },

    highlightRandomSquare() {
      if (this.availableDotSquares.length) {
        this.animateTiles(getRandomItem(this.availableDotSquares), ref => ref.animateBeacon())
      }
    },

    accountTiles(tiles) {
      this.gainScore(sumTilesScorePoinst(tiles))

      this.goals = this.goals.map(goal => {
        const numberOfTiles = tiles.filter(tile => {
          if (isDot(goal.tile)) {
            return goal.tile.color === tile.color
          }

          return goal.tile.type === tile.type
        }).length

        return { ...goal, current: Math.min(goal.target, goal.current + numberOfTiles) }
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
        .then(() => this.$router.push({ name: 'home' }))
    },

    async outOfMoves() {
      await sleep(150)

      this.$modal(OutOfMovesModal)
        .then(() => this.$router.push({ name: 'home' }))
    },

    quitLevel() {
      this.$router.push({ name: 'home' })
    }
  },

  created() {
    this.restart()
  },

  beforeDestroy() {
    this.cancelSquaresHighlighting()
  }
};
</script>

<style lang="postcss">
.LevelView svg {
  overflow: visible;
}

.LevelView__panel {
  @apply flex items-center justify-center h-16 bg-white rounded-lg pb-2 z-1;

  box-shadow: inset 0 -6px 0 0 #e3e3e3;
}
</style>