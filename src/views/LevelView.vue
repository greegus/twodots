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
      <defs>
        <filter id="inner-shadow">
          <!-- <feFlood flood-color="red"/> -->
          <feComposite in2="SourceAlpha" operator="out"/>
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite operator="atop" in2="SourceGraphic"/>
        </filter>
      </defs>

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
      <g v-if="isMakingSelection" style="position: relative; z-index: 1; opacity: 0">
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
      :length="isMakingSelection ? selection.length : 0"
      :color="mappedSelectionColor"
      :is-closed="isSelectionClosed"
    />
  </div>
</template>

<script>
import config from 'config'

import { isSelectionClosed } from 'utils/selection'

import SelectionProgressFrame from 'components/SelectionProgressFrame'
import SelectionLine from 'components/SelectionLine'
import GoalItem from 'components/GoalItem'
import Icon from 'components/Icon'
import MapTile from 'components/tiles/MapTile'

import SuccessModal from 'modals/SuccessModal';
import OutOfMovesModal from 'modals/OutOfMovesModal';

let tileId = 1;

function generateWallTile(position) {
  return {
    ...position,
    id: tileId++,
    type: config.tileTypes.WALL,
    fixed: true
  };
}

function generateDotTile(position, colors = config.dotColors) {
  return {
    ...position,
    id: tileId++,
    type: config.tileTypes.DOT,
    color: getRandomItem([].concat(colors))
  };
}

function generateBombTile(position, originalTile) {
  return {
    ...position,
    originalTile,
    id: tileId++,
    type: config.tileTypes.BOMB
  }
}

function generateMap(level) {
  const symbolToTileMap = {
    'E': undefined,
    '*': position => generateDotTile(position, level.colors),
    'r': position => generateDotTile(position, 'red'),
    'b': position => generateDotTile(position, 'blue'),
    'y': position => generateDotTile(position, 'yellow'),
    'g': position => generateDotTile(position, 'green'),
    'p': position => generateDotTile(position, 'pink'),
    'X': position => generateWallTile(position)
  };

  const tilesMatrix = level.blueprint
    .trim().split("\n").map((row, y) => {
      return row.trim().split(/\s+/).map((symbol, x) => {
          return symbolToTileMap[symbol] && symbolToTileMap[symbol]({ x, y });
        });
    });

  const size = {
    height: tilesMatrix.length,
    width: tilesMatrix[0].length
  };

  return {
    tiles: tilesMatrix.flatMap(row => row).filter(Boolean),
    size
  };
}

function getInitialState(level) {
  return {
    ...generateMap(level),
    movesLeft: level.moves,
    goals: level.goals.map(goal => ({ ...goal, current: 0 })),
    score: 0,
    isSelectionAllowed: true
  }
}

function getNextPossibleTiles(tilesMatrix, tile, lastSelected = undefined) {
  const neighbourTiles = [
    tilesMatrix[tile.y][tile.x - 1],
    tilesMatrix[tile.y][tile.x + 1]
  ];

  const prevRow = tilesMatrix[tile.y - 1];

  if (prevRow) {
    neighbourTiles.push(prevRow[tile.x]);
  }

  const nextRow = tilesMatrix[tile.y + 1];

  if (nextRow) {
    neighbourTiles.push(nextRow[tile.x]);
  }

  return neighbourTiles
    .filter(Boolean)
    .filter(({ color }) => tile.color === color)
    .filter(({ id }) => (lastSelected ? lastSelected.id !== id : true));
}

function sumTilesScorePoinst(tiles) {
  return tiles.reduce((sum, tile) => {
    return sum + (tile.value || 1)
  }, 0)
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// function getMatrixColumn(matrix, columnIndex) {
//   return matrix.map(row => row[columnIndex])
// }

// function walkMatrix(matrix, callback) {
//   matrix.forEach((row, x) => {
//     row.forEach((item, y) => {
//       const column = matrix.map(row => row[x])
//       callback({ item, x, y, row, column })
//     })
//   })
// }

function getTilesEnclosedBySelection(tiles, selection) {
  const lastCoreTile = selection[selection.length - 1]
  const indexOfCoreStart = selection.findIndex(tile => tile.id === lastCoreTile.id)
  const coreSelection = selection.slice(indexOfCoreStart)

  const boundaries = {
    left: Math.min.apply(Math, coreSelection.map(tile => tile.x)),
    right: Math.max.apply(Math, coreSelection.map(tile => tile.x)),
    top: Math.min.apply(Math, coreSelection.map(tile => tile.y)),
    bottom: Math.max.apply(Math, coreSelection.map(tile => tile.y))
  }

  return tiles.filter(tile => (
    tile.x > boundaries.left &&
    tile.x < boundaries.right &&
    tile.y > boundaries.top &&
    tile.y < boundaries.bottom
  ))
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

    mappedSelectionColor() {
      return config.colorsMap[this.selectionColor]
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
      const squareCoordinates = [
        [0,0], [1,0],
        [0,1], [1,1]
      ]

      return this.tiles
        .filter(tile => tile.type === config.tileTypes.DOT)
        .reduce((squares, tile) => {
          const squareTiles = squareCoordinates.map(([ x, y ]) => this.tilesMatrix[tile.y + y] && this.tilesMatrix[tile.y + y][tile.x + x])
          const hasSameColor = squareTiles.every(tileInSquare => tileInSquare && tileInSquare.color === tile.color)

          if (hasSameColor) {
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
      // this.squaresHighlightingInterval = setInterval(() => this.highlightRandomSquare(), 10000)
    },

    cancelSquaresHighlighting() {
      this.squaresHighlightingInterval && clearInterval(this.squaresHighlightingInterval)
    },

    startSelection(tile, event) {
      if (!this.isSelectionAllowed || tile.type !== config.tileTypes.DOT) {
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

      this.getTileComponent(tile).$refs.content.animateBeacon()

      const selectedWithoutLast = this.selection.slice(
        0,
        this.selection.length - 2
      );

      if (this.isSelectionClosed) {
        this.getAllDotTilesOfColor(this.selectionColor).map(this.getTileComponent).forEach(tile => tile.$refs.content.animateBeacon())
      }

      if (selectedWithoutLast.some(({ id }) => id === this.lastSelected.id)) {
        this.nextPossibleTiles = [];
        return;
      }

      const nextPossibleTiles = getNextPossibleTiles(
        this.tilesMatrix,
        tile,
        this.lastSelected
      );

      this.nextPossibleTiles = nextPossibleTiles;
    },

    removeLastFromSelection() {
      this.selection.pop();

      this.nextPossibleTiles = getNextPossibleTiles(
        this.tilesMatrix,
        this.lastSelected,
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
    },

    async popTiles(tiles) {
      this.accountTiles(tiles)

      const animations = tiles
        .map(this.getTileComponent)
        .map(tile => tile.$refs.content.animateDestruction())

      await Promise.all(animations)

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

          if (tile.type !== config.tileTypes.WALL && emptyTiles.length) {
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
      const falls = {}
      let newTiles = [];

      for (let x = 0; x < width; x++) {
        let newTilesInColumn = []

        for (let y = 0; y < height; y++) {
          const tile = this.tilesMatrix[y][x]

          if (!tile) {
            newTilesInColumn.push(generateDotTile({x, y}, colors))
          }
        }

        newTiles = newTiles.concat(newTilesInColumn)

        newTilesInColumn.reverse().forEach((tile, index) => {
          falls[tile.id] = tile.y + index + 1
        })
      }

      this.tiles = this.tiles.concat(newTiles)

      return new Promise(resolve => {
        this.$nextTick(() => {
          const animations = newTiles.map((tile) => {
            return this.getTileComponent(tile).animateFall(falls[tile.id])
          })

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
      if (!this.availableDotSquares.length) {
        return
      }

      getRandomItem(this.availableDotSquares)
        .map(this.getTileComponent)
        .forEach(tile => tile.$refs.content.animateBeacon())
    },

    accountTiles(tiles) {
      this.gainScore(sumTilesScorePoinst(tiles))

      this.goals = this.goals.map(goal => {
        const numberOfTiles = tiles.filter(tile => {
          if (goal.tile.type === config.tileTypes.DOT) {
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
      return this.tiles.filter(
        tile => tile.type === config.tileTypes.DOT && tile.color === color
      );
    },

    getTileComponent(tile) {
      return this.$refs[`tile.${tile.id}`][0]
    },

    // getInnerTileComponents(tile) {
    //   return getTileComponent(tile).$ref.inner
    // },

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