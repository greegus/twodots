<script lang="ts" setup>
import type { Size, WallTile } from '@/types.d';

defineProps<{
  walls: WallTile[],
  size: Size
}>()
</script>

<template>
  <g>
    <svg :width="$props.size.width + 2" :height="$props.size.height + 2" x="-1" y="-1">
      <defs>
        <filter id="shadow">
          <feOffset in="SourceGraphic" dy=".1" />
          <feGaussianBlur result="blurOut" stdDeviation=".1" />
        </filter>

        <mask id="mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect v-for="tile in $props.walls" :key="tile.id" width="1" height="1" :x="tile.position.x + 1" :y="tile.position.y + 1" fill="black" />
        </mask>

        <clipPath id="clipPath">
          <rect v-for="tile in $props.walls" :key="tile.id" width="1" height="1" :x="tile.position.x + 1" :y="tile.position.y + 1" fill="black" />
        </clipPath>
      </defs>

      <g filter="url(#shadow)" clip-path="url(#clipPath)">
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,.2)" mask="url(#mask)" />
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,.2)" />
      </g>
    </svg>
  </g>
</template>
