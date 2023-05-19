<script lang="ts" setup>
import { isDot } from '@/utils/tiles'
import { isSelectionClosed, getTilesEnclosedBySelection, getSelectionColor } from '@/utils/selection'
import { getNeighbourCells } from '@/utils/matrix'
import { hasValue, doesNotHaveId } from '@/utils/helpers'

import * as AudioService from '@/services/AudioService'

import SelectionLine from '@/components/canvas/SelectionLine.vue'
import type { Matrix, Size, Theme, Tile } from '@/types.d'
import { computed, ref } from 'vue'

function getNextPossibleTiles(tilesMatrix: Matrix<Tile>, tile: Tile, lastSelected?: Tile) {
  let tiles = getNeighbourCells<Tile>(tilesMatrix, tile.position)
    .filter(isDot)
    .filter(hasValue('color', tile.color))

  if (lastSelected) {
    tiles = tiles.filter(doesNotHaveId(lastSelected.id))
  }

  return tiles
}

const props = defineProps<{
  tilesMatrix: Matrix<Tile>
  size: Size
  theme: Theme
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'change', payload: {
    selection: Tile[]
    isSelectionClosed: boolean
    selectionColor: string
    lastSelected?: Tile
  }): void
  (e: 'end', payload: {
    selection: Tile[]
    enclosedTiles: Tile[]
    isSelectionClosed: boolean
    selectionColor: string
  }): void
}>()

const selection = ref<Tile[]>([])

const isMakingSelection = ref(false)

const nextPossibleTiles = ref<Tile[]>([])

const tiles = computed(() => props.tilesMatrix.flat())

const selectableTiles = computed(() => tiles.value.filter(isDot))

const isClosed = computed(() => isSelectionClosed(selection.value))

const enclosedTiles = computed(() => getTilesEnclosedBySelection(tiles.value, selection.value))

const color = computed(() => getSelectionColor(selection.value, props.theme))

const lastSelected = computed(() => selection.value[selection.value.length - 1])

const secondLastSelected = computed(() => selection.value[selection.value.length - 2])

const playSelectionThumb = () => {
  AudioService.playSelectionThumb(selection.value.length, isClosed.value)
}

const handleSelectionChange = () => {
  nextPossibleTiles.value = isClosed.value
    ? []
    : getNextPossibleTiles(
      props.tilesMatrix,
      lastSelected.value,
      lastSelected.value
    )

  playSelectionThumb()

  emit('change', {
    selection: selection.value,
    isSelectionClosed: isClosed.value,
    selectionColor: color.value,
    lastSelected: lastSelected.value
  })
}

const addToSelection = (e: Event, tile: Tile) => {
  e.preventDefault()

  selection.value.push(tile)

  handleSelectionChange()
}

const removeLastFromSelection = (e: Event) => {
  e.preventDefault()

  selection.value.pop()

  handleSelectionChange()
}

const startSelection = (e: Event, tile: Tile) => {
  isMakingSelection.value = true
  selection.value = []

  emit('start')

  addToSelection(e, tile)

  window.addEventListener('pointerup', endSelection)
}


const endSelection = (e: Event) => {
  e.preventDefault()

  window.removeEventListener('pointerup', endSelection)

  isMakingSelection.value = false
  nextPossibleTiles.value = []

  emit('end', {
    selection: selection.value,
    enclosedTiles: enclosedTiles.value,
    isSelectionClosed: isClosed.value,
    selectionColor: color.value
  })

  selection.value = []
}

const releasePointerCapture = (e: PointerEvent) => {
  (e.target as HTMLElement).releasePointerCapture(e.pointerId)
}
</script>

<template>
  <g>
    <!-- line -->
    <SelectionLine :selection="selection" :theme="theme" :size="size" v-if="isMakingSelection" />

    <!-- zones -->
    <g v-if="isMakingSelection" class="opacity-0">
      <rect v-for="tile in nextPossibleTiles" v-bind="tile.position" :key="tile.id" width="1" height="1"
        @pointerenter.prevent="addToSelection($event, tile)" />

      <rect v-if="secondLastSelected" v-bind="secondLastSelected.position" width="1" height="1"
        @pointerenter="removeLastFromSelection($event)" />
    </g>

    <g v-else-if="!disabled" class="opacity-0">
      <rect v-for="tile in selectableTiles" v-bind="tile.position" :key="`selectable.${tile.id}`" width="1" height="1"
        @pointerdown="startSelection($event, tile)" @gotpointercapture="releasePointerCapture" />
    </g>
  </g>
</template>
