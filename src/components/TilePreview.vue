<script setup lang="ts">
import type { Theme, Tile } from '@/types.d';
import { computed } from 'vue';

import { getTilePreviewComponent } from '@/utils/tiles'

const props = defineProps<{
  tile: Tile
  theme: Theme
}>()

const component = computed(() => getTilePreviewComponent(props.tile.type))
</script>


<template>
  <svg viewBox="0 0 1 1">
    <component :is="component" :tile="tile" :theme="theme" />
  </svg>
</template>

