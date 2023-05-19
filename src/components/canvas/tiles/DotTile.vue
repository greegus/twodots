<script setup lang="ts">
import anime from 'animejs'
import type { DotTile, Theme } from '@/types.d';

import { computed, ref } from 'vue';

const props = defineProps<{
  tile: DotTile,
  theme: Theme
}>()

const dotRef = ref<SVGCircleElement>()
const beaconRef = ref<SVGCircleElement>()

const hexColor = computed(() => props.theme.colorMap.dots[props.tile.color])

const animateBurn = () => {
  return anime({
    targets: dotRef.value,
    fill: '#333',
    easing: 'linear',
    duration: 150
  }).finished
}

const animateBeacon = () => {
  return anime({
    targets: beaconRef.value,
    scale: [1, 2.5],
    opacity: [1, 0],
    easing: 'linear',
    duration: 400
  }).finished
}

defineExpose({
  animateBurn,
  animateBeacon
})
</script>


<template>
  <g class="DotTile" transform-origin="0.5 0.5">
    <circle ref="beacon" cx="0.5" cy="0.5" r="0.26" :fill="hexColor" transform-origin="0.5 0.5"
      class="pointer-events-none will-transform" />
    <circle cx="0.5" cy="0.5" r="0.26" :fill="hexColor" class="will-transform" ref="dot" />
    <circle class="opacity-0" cx="0.5" cy="0.5" r="0.4" fill="black" />
  </g>
</template>