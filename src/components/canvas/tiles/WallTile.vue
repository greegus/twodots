<script lang="ts" setup>
import type { WallTile, Theme } from '@/types.d';

defineProps<{
  tile: WallTile,
  theme: Theme
}>()
</script>

<template>
  <g class="WallTile">
    <!-- rendered by WallsLayer -->
  </g>
</template>
