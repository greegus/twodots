<template>
  <div class="TwoDots">
    <svg
      :width="realSize.width"
      :height="realSize.height"
      :viewBox="`0 0 ${size.width} ${size.height}`"
      ref="tileCanvas"
    >
      <g>
        <svg v-for="tile in nonEmptyTiles" :key="tile.id" :x="tile.x" :y="tile.y">
          <g v-if="tile.type === 'dot'">
            <DotTile @mousedown.native="startSelection(tile, $event)" :dot="tile" :is-selected="selectionById[tile.id]" />
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
          <circle cx="0.5" cy="0.5" r="0.32" @mouseenter="addToSelection(tile)" />
        </svg>

        <svg v-if="secondLastSelected" :x="secondLastSelected.x" :y="secondLastSelected.y">
          <rect width="1" height="1" @mouseenter="removeLastFromSelection()" style="transform: scale(1.2);" transform-origin="0.5 0.5" />
        </svg>
      </g>
    </svg>

    <!-- frame -->
    <SelectionProgressFrame :length="selection.length" :color="mappedSelectionColor" :is-closed="isSelectionSquare" />

    <button @click="restart" class="mx-auto mt-10">restart</button>
  </div>
</template>

<script>
import config from 'config'

import DotTile from 'components/tiles/DotTile.vue'
import SelectionProgressFrame from 'components/SelectionProgressFrame.vue'

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
    '*': position => generateDotTile(position, level.allowedColors),
    'r': position => generateDotTile(position, 'red'),
    'b': position => generateDotTile(position, 'blue')
  };

  const tilesMatrix = level.map
    .trim().split("\n").map((row, y) => {
      return row.trim().split(/\s+/).map((symbol, x) => {
          return symbolToTileMap[symbol] && symbolToTileMap[symbol]({ x, y });
        });
    });

  // todo: check rows integrity

  const size = {
    width: tilesMatrix.length,
    height: tilesMatrix[0].length
  };

  return {
    tiles: tilesMatrix.flatMap(row => row),
    size
  };
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
  name: "TwoDots",

  components: {
    DotTile,
    SelectionProgressFrame
  },

  props: {
    level: {
      type: Object,
      default: () => ({
        map: `
          r * * * *
          r * * * *
          r * * * *
          r r * * *
          r r * * *
        `,
        allowedColors: ["blue", "red", "green"],
      })
    }
  },

  data() {
    return {
      size: { width: 0, height: 0 },
      tiles: [],
      isMakingSelection: false,
      selection: [],
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

      if (!this.isSelectionSquare) {
        points.push(`${this.mouseRelativePosition.x},${this.mouseRelativePosition.y}`)
      }

      return points.join(" ");
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

    isSelectionSquare() {
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
    }
  },

  methods: {
    restart() {
      const { tiles, size } = buildLevel(this.level);

      this.tiles = tiles;
      this.size = size;
    },

    startSelection(tile, event) {
      const nextPossibleTiles = getNextPossibleTiles(this.tilesMatrix, tile);

      this.trackSelectionCursor(event);

      this.isMakingSelection = true;
      this.nextPossibleTiles = nextPossibleTiles;
      this.selection = [tile];

      window.addEventListener("mouseup", this.finishSelection);
      window.addEventListener("mousemove", this.trackSelectionCursor);
    },

    addToSelection(tile) {
      this.selection.push(tile);

      const selectedWithoutLast = this.selection.slice(
        0,
        this.selection.length - 2
      );

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

    finishSelection() {
      window.removeEventListener("mouseup", this.finishSelection);
      window.removeEventListener("mousemove", this.trackSelectionCursor);

      if (this.selection.length > 1) {
        const allowedColors = this.level.allowedColors;

        const tilesToPop = this.isSelectionSquare
          ? this.getAllDotTilesOfColor(this.selectionColor)
          : this.selection;

        const colors = this.isSelectionSquare
          ? allowedColors.filter(color => color !== this.selectionColor)
          : allowedColors;

        this.popTiles(tilesToPop);
        this.fallDown();
        this.fillWithDots(colors);
      }

      this.isMakingSelection = false;
      this.nextPossibleTiles = [];
      this.selection = [];
      this.mouseRelativePosition = undefined;
    },

    trackSelectionCursor(e) {
      const { top, left } = this.$refs.tileCanvas.getBoundingClientRect()

      const relativePosition = {
        x: (e.clientX - left) / TILE_SIZE,
        y: (e.clientY - top) / TILE_SIZE
      };

      this.mouseRelativePosition = relativePosition;
    },

    popTiles(tiles) {
      this.tiles = this.nonEmptyTiles.map(tile => {
        return tiles.some(({ id }) => id === tile.id) ? undefined : tile;
      });
    },

    fallDown() {
      const { width, height } = this.size;
      const tileToDrop = {};

      for (let column = 0; column < width; column++) {
        let depth = 0;

        for (let row = height - 1; row >= 0; row--) {
          const tile = this.tilesMatrix[row][column];

          if (!tile) {
            depth++;
            continue;
          }

          if (tile.type === TILE_TYPES.DOT && depth > 0) {
            tileToDrop[tile.id] = depth;
          }
        }
      }

      this.tiles = this.nonEmptyTiles.map(tile => ({
        ...tile,
        y: tile.y + (tileToDrop[tile.id] || 0)
      }));
    },

    fillWithDots(colors) {
      const { width, height } = this.size;
      const newDotTiles = [];

      for (let column = 0; column < width; column++) {
        for (let row = 0; row < height; row++) {
          const tile = this.tilesMatrix[row][column];

          if (tile) {
            break;
          }

          const position = {
            x: column,
            y: row
          };

          newDotTiles.push(generateDotTile(position, colors));
        }
      }

      this.tiles = this.tiles.concat(newDotTiles);
    },

    getAllDotTilesOfColor(color) {
      return this.nonEmptyTiles.filter(
        tile => tile.type === TILE_TYPES.DOT && tile.color === color
      );
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
</style>