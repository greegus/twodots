<script lang="ts" setup>
import TilePreview from '@/components/TilePreview.vue'
import ModifierPreview from '@/components/ModifierPreview.vue'
import type { Goal, Theme } from '@/types.d';
import { computed } from 'vue';

const props = defineProps<{
  goal: Goal,
  theme: Theme
}>()

const isModifier = computed(() => 'modifier' in props.goal)
</script>

<template>
  <component :is="isModifier ? ModifierPreview : TilePreview" :theme="theme"
    v-bind="isModifier ? { modifier: goal.modifier } : { tile: goal.tile }" />
</template>

