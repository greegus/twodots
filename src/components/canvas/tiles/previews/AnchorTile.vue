<script lang="ts" setup>
import type { AnchorTile, Theme } from '@/types.d';

defineProps<{
  tile: AnchorTile,
  theme: Theme
}>()
</script>



<template>
  <svg viewBox="0 0 1 1">
    <image class="object-contain overflow-hidden" href="@/assets/images/tiles/anchor.svg" width="1" height="1"
      preserveAspectRatio="none" />
  </svg>
</template>
