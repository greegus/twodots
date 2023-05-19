<script lang="ts" setup>
import anime from 'animejs'

import { getTileComponent } from '@/utils/tiles'
import type { Theme, Tile } from '@/types.d';
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  tile: Tile,
  theme: Theme
}>()

const rootRef = ref<SVGElement>()

const component = computed(() => getTileComponent(props.tile.type))

const animateDestruction = () => {
  return anime({
    targets: rootRef.value,
    scale: 0,
    easing: 'linear',
    duration: 150
  }).finished
}

const bounce = async (speed: number) => {
  const maxSpeed = 10
  speed = Math.min(maxSpeed, speed)

  return anime({
    targets: rootRef.value,
    easing: () => (x: number) => (-Math.pow(2 * x - 1, 2) + 1),
    duration: 150,
    translateY: -0.05 * (props.tile.position.y === 0 ? maxSpeed * 1.5 : speed),
  }).finished
}

const animateFall = async (waypoints: { x: number, y: number }[]) => {
  const keyframes = waypoints
    // Relativize waypoints
    .map(({ x, y }) => ({
      translateX: x - props.tile.position.x,
      translateY: y - props.tile.position.y
    }))

  // Force starting position without animaition
  await anime({
    targets: rootRef.value,
    ...keyframes[0],
    easing: 'linear',
    duration: 0
  }).finished

  await anime({
    targets: rootRef.value,
    easing: 'linear',
    duration: 50 * keyframes.length,
    keyframes,
  }).finished

  await bounce(keyframes.length)
}

onMounted(() => {
  anime({
    targets: rootRef.value,
    opacity: [0, 1],
    easing: 'linear',
    duration: 50
  })
})

defineExpose({
  animateDestruction,
  animateFall
})
</script>

<template>
  <g class="MapTile will-transform" transform-origin="0.5 0.5" ref="rootRef">
    <component :is="component" :tile="tile" :theme="theme" ref="content" />
  </g>
</template>
