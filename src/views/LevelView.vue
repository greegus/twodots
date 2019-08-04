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
      <g>
        <svg v-for="tile in nonEmptyTiles" :key="tile.id" :x="tile.x" :y="tile.y">
          <component :is="tileToComponentMap[tile.type]" @mousedown.native="startSelection(tile, $event)" :tile="tile" :ref="`tile.${tile.id}`" />
        </svg>
      </g>

      <!-- selection line -->
      <g v-if="isMakingSelection">
        <polyline :points="selectionPoints" :stroke="mappedSelectionColor" stroke-width=".12" fill="none" stroke-linecap="round" />
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
      :length="isMakingSelection ? selection.length : 0"
      :color="mappedSelectionColor"
      :is-closed="isSelectionClosed"
    />
  </div>
</template>

<script>
import config from 'config'

import SelectionProgressFrame from 'components/SelectionProgressFrame'
import GoalItem from 'components/GoalItem'
import Icon from 'components/Icon'

import DotTile from 'components/tiles/DotTile'

import SuccessModal from 'modals/SuccessModal';
import OutOfMovesModal from 'modals/OutOfMovesModal';

console.log(config)

let tileId = 1;

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDotTile(position, color = config.dotColors) {
  return {
    ...position,
    id: tileId++,
    color: getRandomItem([].concat(color)),
    type: config.tileTypes.DOT
  };
}

function generateMap(level) {
  const symbolToTileMap = {
    '*': position => generateDotTile(position, level.colors),
    'r': position => generateDotTile(position, 'red'),
    'b': position => generateDotTile(position, 'blue'),
    'y': position => generateDotTile(position, 'yellow'),
    'g': position => generateDotTile(position, 'green'),
    'p': position => generateDotTile(position, 'pink')
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
    tiles: tilesMatrix.flatMap(row => row),
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

async function sleep(time) {
  await new Promise(resolve => setTimeout(resolve, time))
}

export default {
  name: 'LevelView',

  components: {
    SelectionProgressFrame,
    GoalItem,
    Icon,

    DotTile,
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
      relativeMousePosition: undefined,
      tileToComponentMap: {
        [config.tileTypes.DOT]: DotTile
      }
    };
  },

  computed: {
    realSize() {
      return {
        width: this.size.width * config.tileSize,
        height: this.size.height * config.tileSize
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
        points.push(`${this.relativeMousePosition.x},${this.relativeMousePosition.y}`)
      }

      return points.join(' ');
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

    startSelection(tile, event) {
      if (!this.isSelectionAllowed || tile.type !== config.tileTypes.DOT) {
        return
      }

      this.isMakingSelection = true;
      this.selection = []

      this.cancelSquaresHighlighting()
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

    async endSelection() {
      window.removeEventListener('mouseup', this.endSelection);
      window.removeEventListener('mousemove', this.trackSelectionCursor);

      this.isMakingSelection = false;
      this.isSelectionAllowed = false;
      this.relativeMousePosition = undefined;
      this.nextPossibleTiles = [];

      if (this.selection.length > 1) {
        this.movesLeft = this.movesLeft - 1

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

    trackSelectionCursor(e) {
      const { top, left } = this.$refs.tileCanvas.getBoundingClientRect()

      const relativePosition = {
        x: (e.clientX - left) / config.tileSize,
        y: (e.clientY - top) / config.tileSize
      };

      this.relativeMousePosition = relativePosition;
    },

    async popTiles(tiles) {
      this.accountTiles(tiles)

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

          if (tile.type === config.tileTypes.DOT && depth > 0) {
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
          this.getTileComponent({ id }).animateFall(depth)
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

      return new Promise(resolve => {
        this.$nextTick(() => {
          const animations = newTiles.map((tile) => {
            return this.getTileComponent(tile).animateFall(tile.initialDepth)
          })

          Promise.all(animations).then(resolve)
        })
      })
    },

    highlightRandomSquare() {
      if (!this.availableDotSquares.length) {
        return
      }

      getRandomItem(this.availableDotSquares)
        .map(this.getTileComponent)
        .forEach(dotTile => dotTile.animateBeacon())
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
      return this.nonEmptyTiles.filter(
        tile => tile.type === config.tileTypes.DOT && tile.color === color
      );
    },

    getTileComponent(tile) {
      return this.$refs[`tile.${tile.id}`][0]
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
    this.restart();
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