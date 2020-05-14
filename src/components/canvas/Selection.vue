<template>
  <g>
    <!-- line -->
    <SelectionLine
      :selection="selection"
      :theme="theme"
      :size="size"
      v-if="isMakingSelection"
    />

    <!-- zones -->
    <g v-if="isMakingSelection" class="opacity-0">
      <rect
        v-for="tile in nextPossibleTiles"
        v-bind="tile.position"
        :key="tile.id"
        width="1"
        height="1"
        @pointerenter="addToSelection(tile, $event)"
      />

      <rect
        v-if="secondLastSelected"
        v-bind="secondLastSelected.position"
        width="1"
        height="1"
        @pointerenter="removeLastFromSelection($event)"
      />
    </g>

    <g v-else-if="!disabled" class="opacity-0">
      <rect
        v-for="tile in selectableTiles"
        v-bind="tile.position"
        :key="`selectable.${tile.id}`"
        width="1"
        height="1"
        @pointerdown="startSelection(tile)"
        @gotpointercapture="releasePointerCapture"
      />
    </g>
  </g>
</template>

<script>
import { isDot } from 'utils/tiles'
import { isSelectionClosed, getTilesEnclosedBySelection } from 'utils/selection'
import { getNeighbourCells } from 'utils/matrix'
import { hasValue, doesNotHaveId } from 'utils/helpers'

import * as AudioService from 'services/AudioService'

import SelectionLine from 'components/canvas/SelectionLine'

function getNextPossibleTiles(tilesMatrix, tile, lastSelected = undefined) {
  let tiles = getNeighbourCells(tilesMatrix, tile.position)
    .filter(isDot)
    .filter(hasValue('color', tile.color))

  if (lastSelected) {
    tiles = tiles.filter(doesNotHaveId(lastSelected.id))
  }

  return tiles
}

export default {
  components: {
    SelectionLine
  },

  props: {
    tilesMatrix: {
      type: Array,
      required: true
    },

    size: {
      type: Object,
      required: true
    },

    theme: {
      type: Object,
      required: true
    },

    disabled: {
      tyoe: Boolean
    }
  },

  data() {
    return {
      selection: [],
      isMakingSelection: false,
      nextPossibleTiles: []
    }
  },

  computed: {
    tiles() {
      return this.tilesMatrix.flat()
    },

    selectableTiles() {
      return this.tiles.filter(isDot)
    },

    isSelectionClosed() {
      return isSelectionClosed(this.selection)
    },

    enclosedTiles() {
      return getTilesEnclosedBySelection(this.tiles, this.selection)
    },

    selectionColor() {
      return this.selection.length && this.selection[0].color || undefined
    },

    lastSelected() {
      return this.selection[this.selection.length - 1]
    },

    secondLastSelected() {
      return this.selection[this.selection.length - 2]
    },
  },

  methods: {
    startSelection(tile) {
      this.isMakingSelection = true
      this.selection = []

      this.$emit('start')

      this.addToSelection(tile)

      window.addEventListener('pointerup', this.endSelection)
    },

    addToSelection(tile) {
      this.selection.push(tile)

      this.handleSelectionChange()
    },

    removeLastFromSelection(e) {
      e.preventDefault()

      this.selection.pop()

      this.handleSelectionChange()
    },

    handleSelectionChange() {
      this.nextPossibleTiles = this.isSelectionClosed
        ? []
        : getNextPossibleTiles(
            this.tilesMatrix,
            this.lastSelected,
            this.lastSelected
          )

      this.playSelectionThumb()

      this.$emit('change', {
        selection: this.selection,
        isSelectionClosed: this.isSelectionClosed,
        selectionColor: this.selectionColor,
        lastSelected: this.lastSelected
      })
    },

    async endSelection(e) {
      e.preventDefault()

      window.removeEventListener('pointerup', this.endSelection)

      this.isMakingSelection = false
      this.nextPossibleTiles = []

      this.$emit('end', {
        selection: this.selection,
        enclosedTiles: this.enclosedTiles,
        isSelectionClosed: this.isSelectionClosed,
        selectionColor: this.selectionColor
      })

      this.selection = []
    },

    releasePointerCapture(e) {
      e.target.releasePointerCapture(e.pointerId)
    },

    playSelectionThumb() {
      AudioService.playSelectionThumb(this.selection.length, this.isSelectionClosed)
    }
  }
}
</script>