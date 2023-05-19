<script lang="ts" setup>
import type { Modifier, Theme } from '@/types.d';
import { getModifierPreviewComponent } from '@/utils/modifiers'
import { computed } from 'vue';

const props = defineProps<{
  modifier: Modifier
  theme: Theme
}>()

const component = computed(() => getModifierPreviewComponent(props.modifier.type))
</script>


<template>
  <component :is="component" :modifier="modifier" :theme="theme" />
</template>
