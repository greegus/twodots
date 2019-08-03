<template>
  <div class="TwoDots">
    <div class="flex align-center text-gray-700 mb-12">
      <div class="TwoDots__panel px-0 w-16 mr-5">
        <div class="text-center">
          <div class="text-2xl leading-tight">{{ movesLeft }}</div>
          <div class="uppercase text-xs font-semibold">Moves</div>
        </div>
      </div>

      <div class="TwoDots__panel px-5">
        <div v-for="(goal, $index) in goals" :key="$index">
          <GoalStatus :goal="goal" />
        </div>
      </div>
    </div>

    <svg
      :width="realSize.width"
      :height="realSize.height"
      :viewBox="`0 0 ${size.width} ${size.height}`"
      class="mx-auto"
      ref="tileCanvas"
    >
      <g>
        <svg v-for="tile in nonEmptyTiles" :key="tile.id" :x="tile.x" :y="tile.y">
          <g v-if="tile.type === 'dot'">
            <DotTile @mousedown.native="hasMovesLeft && startSelection(tile, $event)" :dot="tile" :is-selected="selectionById[tile.id]" :ref="`tile.${tile.id}`" />
          </g>
        </svg>
      </g>

      <!-- selection line -->
      <g v-if="isMakingSelection">
        <polyline :points="selectionPoints" :stroke="mappedSelectionColor" stroke-width=".15" fill="none" stroke-linecap="round" />
      </g>

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
      :length="selection.length"
      :color="mappedSelectionColor"
      :is-closed="isSelectionClosed"
    />
  </div>
</template>

<script>
import config from 'config'

import DotTile from 'components/tiles/DotTile.vue'
import SelectionProgressFrame from 'components/SelectionProgressFrame.vue'
import GoalStatus from 'components/GoalStatus.vue'
import { setInterval, clearInterval } from 'timers';

const TILE_SIZE = 50;
const DOT_COLORS = ["red", "blue", "purple"];

const TILE_TYPES = {
  EMPTY: "empty",
  DOT: "dot"
};

let tileId = 1;

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDotTile(position, color = DOT_COLORS) {
  return {
    ...position,
    id: tileId++,
    color: getRandomItem([].concat(color)),
    type: TILE_TYPES.DOT
  };
}

function buildLevel(level) {
  const symbolToTileMap = {
    '*': position => generateDotTile(position, level.colors),
    'r': position => generateDotTile(position, 'red'),
    'b': position => generateDotTile(position, 'blue'),
    'y': position => generateDotTile(position, 'yellow')
  };

  const tilesMatrix = level.map
    .trim().split("\n").map((row, y) => {
      return row.trim().split(/\s+/).map((symbol, x) => {
          return symbolToTileMap[symbol] && symbolToTileMap[symbol]({ x, y });
        });
    });

  const size = {
    width: tilesMatrix.length,
    height: tilesMatrix[0].length
  };

  return {
    tiles: tilesMatrix.flatMap(row => row),
    size
  };
}

function initLevelState(level) {
  return {
    ...buildLevel(level),
    movesLeft: level.moves,
    goals: level.goals.map(goal => ({ ...goal, current: 0 }))
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

export default {
  name: 'TwoDots',

  components: {
    DotTile,
    SelectionProgressFrame,
    GoalStatus
  },

  props: {
    level: {
      type: Object,
      default: () => ({
        map: `
          * * * * *
          * * * * *
          * * * * *
          r r * * *
          r r * * *
        `,
        colors: ['blue', 'red', 'green', 'purple'],
        moves: 12,
        goals: [
          {color: 'red', target: 20},
          {color: 'blue', target: 20},
          {color: 'green', target: 20},
        ]
      })
    }
  },

  data() {
    return {
      ...initLevelState(this.level),
      selection: [],
      isMakingSelection: false,
      nextPossibleTiles: [],
      mouseRelativePosition: undefined,
    };
  },

  computed: {
    realSize() {
      return {
        width: this.size.width * TILE_SIZE,
        height: this.size.height * TILE_SIZE
      };
    },

    nonEmptyTiles() {
      return this.tiles.filter(Boolean);
    },

    tilesMatrix() {
      let matrix = Array.from({ length: this.size.height }).map(() =>
        Array.from({ length: this.size.width })
      );

      this.nonEmptyTiles.forEach(tile => (matrix[tile.y][tile.x] = tile));

      return matrix;
    },

    selectionPoints() {
      const points = this.selection
        .map(tile => `${tile.x + 0.5},${tile.y + 0.5}`)

      if (!this.isSelectionClosed) {
        points.push(`${this.mouseRelativePosition.x},${this.mouseRelativePosition.y}`)
      }

      return points.join(' ');
    },

    selectionById() {
      return this.selection.reduce((acc, tile) => ({ ...acc, [tile.id]: true }), {})
    },

    selectionColor() {
      return this.selection.length && this.selection[0].color;
    },

    mappedSelectionColor() {
      return config.colorsMap[this.selectionColor]
    },

    isSelectionClosed() {
      return (
        this.selection.findIndex(tile => tile.id === this.lastSelected.id) <
        this.selection.length - 2
      );
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

    hasFullfilledGoals() {
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
      const { tiles, size, movesLeft, goals } = initLevelState(this.level);

      this.tiles = tiles;
      this.size = size;
      this.movesLeft = movesLeft
      this.goals = goals

      this.cancelSquaresHighlighting()
      this.initSquaresHighlighting()
    },

    initSquaresHighlighting() {
      this.squaresHighlightingInterval = setInterval(() => this.highlightRandomSquare(), 10000)
    },

    cancelSquaresHighlighting() {
      this.squaresHighlightingInterval && clearInterval(this.squaresHighlightingInterval)
    },

    startSelection(tile, event) {
      this.isMakingSelection = true;
      this.selection = []

      this.trackSelectionCursor(event);
      this.addToSelection(tile)

      window.addEventListener('mouseup', this.endSelection);
      window.addEventListener('mousemove', this.trackSelectionCursor);
    },

    addToSelection(tile) {
      this.selection.push(tile);

      this.getTileComponent(tile).animateBeacon()

      const selectedWithoutLast = this.selection.slice(
        0,
        this.selection.length - 2
      );

      if (this.isSelectionClosed) {
        this.getAllDotTilesOfColor(this.selectionColor).map(this.getTileComponent).forEach(dot => dot.animateBeacon())
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

    endSelection() {
      window.removeEventListener('mouseup', this.endSelection);
      window.removeEventListener('mousemove', this.trackSelectionCursor);

      this.isMakingSelection = false;
      this.mouseRelativePosition = undefined;
      this.nextPossibleTiles = [];

      if (this.selection.length > 1) {
        const colors = this.level.colors;

        const tilesToPop = this.isSelectionClosed
          ? this.getAllDotTilesOfColor(this.selectionColor)
          : this.selection;

        const availableColors = this.isSelectionClosed
          ? colors.filter(color => color !== this.selectionColor)
          : colors;

        (async () => {
          this.cancelSquaresHighlighting()

          await this.popTiles(tilesToPop);
          await this.fallDown();
          await this.fillWithDots(availableColors);

          this.initSquaresHighlighting()
        })()

        this.accountTiles(tilesToPop)
        this.decrementMoves()
      }

      this.selection = []
    },

    decrementMoves() {
      this.movesLeft = this.movesLeft - 1
    },

    trackSelectionCursor(e) {
      const { top, left } = this.$refs.tileCanvas.getBoundingClientRect()

      const relativePosition = {
        x: (e.clientX - left) / TILE_SIZE,
        y: (e.clientY - top) / TILE_SIZE
      };

      this.mouseRelativePosition = relativePosition;
    },

    async popTiles(tiles) {
      const animations = tiles
        .map(this.getTileComponent)
        .map(component => component.animateDestruction())

      await Promise.all(animations)

      this.tiles = this.nonEmptyTiles.map(tile => {
        return tiles.some(({ id }) => id === tile.id) ? undefined : tile;
      });
    },

    async fallDown() {
      const { width, height } = this.size;
      const tilesToFall = {};

      for (let column = 0; column < width; column++) {
        let depth = 0;

        for (let row = height - 1; row >= 0; row--) {
          const tile = this.tilesMatrix[row][column];

          if (!tile) {
            depth++;
            continue;
          }

          if (tile.type === TILE_TYPES.DOT && depth > 0) {
            tilesToFall[tile.id] = depth;
          }
        }
      }

      this.tiles = this.nonEmptyTiles.map(tile => ({
        ...tile,
        y: tile.y + (tilesToFall[tile.id] || 0)
      }));

      this.$nextTick(() => {
        Object.entries(tilesToFall).forEach(([id, depth]) => {
          return this.getTileComponent({ id }).animateFall(depth)
        })
      })
    },

    fillWithDots(colors) {
      const { width, height } = this.size;
      let newTiles = [];

      for (let column = 0; column < width; column++) {
        let newTilesInThisColumn = []

        for (let row = 0; row < height; row++) {
          const tile = this.tilesMatrix[row][column];

          if (tile) {
            break;
          }

          const position = {
            x: column,
            y: row
          };

          newTilesInThisColumn.push(generateDotTile(position, colors));
        }

        newTilesInThisColumn = newTilesInThisColumn.map((tile) => {
          return { ...tile, initialDepth: newTilesInThisColumn.length }
        })

        newTiles = newTiles.concat(newTilesInThisColumn)
      }

      this.tiles = this.tiles.concat(newTiles);

      this.$nextTick(() => {
        newTiles.forEach((tile) => {
          return this.getTileComponent(tile).animateFall(tile.initialDepth)
        })
      })
    },

    highlightRandomSquare() {
      if (!this.availableDotSquares.length) {
        return
      }

      getRandomItem(this.availableDotSquares)
        .map(this.getTileComponent)
        .forEach(dot => dot.animateBeacon())
    },

    accountTiles(tiles) {
      this.goals = this.goals.map(goal => {
        const numberOfTiles = tiles.filter(tile => {
          return tile.color === goal.color
        }).length

        return { ...goal, current: Math.min(goal.target, goal.current + numberOfTiles) }
      })
    },

    getAllDotTilesOfColor(color) {
      return this.nonEmptyTiles.filter(
        tile => tile.type === TILE_TYPES.DOT && tile.color === color
      );
    },

    getTileComponent(tile) {
      return this.$refs[`tile.${tile.id}`][0]
    }
  },

  created() {
    this.restart();
  }
};
</script>

<style lang="postcss">
.TwoDots svg {
  overflow: visible;
  user-select: none;
}

.TwoDots__panel {
  @apply flex items-center justify-center h-16 bg-white rounded-lg pb-2;

  box-shadow: inset 0 -6px 0 0 #e3e3e3;
}
</style>