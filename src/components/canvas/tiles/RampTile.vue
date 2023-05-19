<script lang="ts" setup>
import type { RampTile, Theme } from '@/types.d';

defineProps<{
  tile: RampTile,
  theme: Theme
}>()
</script>


<template>
  <g>
    <image xlink:href="@/assets/images/tiles/ramp.svg" width="1" height="1"
      :style="{ transformOrigin: '0.5px 0.5px', transform: tile.orientation === 'left' ? 'rotateY(180deg)' : '' }" />
  </g>
</template>