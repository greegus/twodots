<script setup lang="ts">
import type { AnchorTile, Theme } from '@/types.d';

defineProps<{
  tile: AnchorTile,
  theme: Theme
}>()
</script>

<template>
  <g>
    <image
      class="object-contain overflow-hidden"
      href="@/assets/images/tiles/anchor.svg"
      x=".225"
      y=".225"
      width=".55"
      height=".55"
      preserveAspectRatio="none"
    />
  </g>
</template>
