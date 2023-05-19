<script lang="ts" setup>
import type { DotTile, Theme } from '@/types.d';
import { computed } from 'vue';

const props = defineProps<{
  tile: DotTile,
  theme: Theme
}>()

const hexColor = computed(() =>
  props.theme.colorMap.dots[props.tile.color]
)
</script>


<template>
  <svg viewBox="0 0 1 1">
    <circle cx="0.5" cy="0.5" r="0.5" :fill="hexColor" class="will-transform" ref="dot" />
  </svg>
</template>
