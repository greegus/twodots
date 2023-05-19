<script lang="ts" setup>
import type { Modifier, Theme } from '@/types.d';
import { getModifierComponent } from '@/utils/modifiers'
import { computed } from 'vue';

const props = defineProps<{
  modifier: Modifier
  theme: Theme
}>()

const component = computed(() => getModifierComponent(props.modifier.type))
</script>

<template>
  <component :is="component" :modifier="modifier" :theme="theme" ref="content" />
</template>
