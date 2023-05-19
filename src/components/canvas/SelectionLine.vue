<script lang="ts" setup>
import type { Point, Size, Theme, Tile } from '@/types.d';
import { getSelectionColor, isSelectionClosed } from '@/utils/selection'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
  theme: Theme
  size: Size
  selection: Tile[]
}>()

const placeholderRef = ref<SVGElement>()

const relativeMousePosition = ref<Point>()

const boundingBox = ref<DOMRect>()

const points = computed(() => {
  if (!props.selection.length || !relativeMousePosition.value) {
    return
  }

  const points = props.selection
    .map(tile => `${tile.position.x + 0.5},${tile.position.y + 0.5}`)

  if (!isSelectionClosed(props.selection)) {
    points.push(`${relativeMousePosition.value.x},${relativeMousePosition.value.y}`)
  }

  return points.join(' ')
})

const color = computed(() => getSelectionColor(props.selection, props.theme))

const updateMousePosition = ({ clientX, clientY }: PointerEvent) => {
  if (!boundingBox.value) {
    return
  }

  const { top, left, width, height } = boundingBox.value

  const relativePosition: Point = {
    x: (clientX - left) / width * props.size.width,
    y: (clientY - top) / height * props.size.height
  }

  relativeMousePosition.value = relativePosition
}

onMounted(() => {
  boundingBox.value = placeholderRef.value!.getBoundingClientRect()
  window.addEventListener('pointermove', updateMousePosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', updateMousePosition)
})
</script>


<template>
  <g>
    <rect x="0" y="0" width="100%" height="100%" fill="transparent" class="pointer-events-none" ref="placeholderRef" />
    <polyline :points="points" :stroke="color" stroke-width=".12" fill="none" stroke-linecap="round" />
  </g>
</template>

