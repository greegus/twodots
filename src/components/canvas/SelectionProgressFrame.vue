<script lang="ts" setup>
import type { Theme, Tile } from '@/types.d';
import { getSelectionColor, isSelectionClosed } from '@/utils/selection'
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  selection: Tile[],
  isActive?: boolean,
  theme: Theme
}>(), {
  selection: () => [],
  isActive: false
})

const size = 'width: calc(50% + 1px); height: calc(50% + 1px);'

const corners = [
      `${size} top: 0; left: 0;`,
      `${size} top: 0; right: 0; transform: rotateY(180deg)`,
      `${size} bottom: 0; right: 0; transform: rotateX(180deg) rotateY(180deg)`,
      `${size} bottom: 0; left: 0; transform: rotateX(180deg)`
    ]

const rootRef = ref<HTMLDivElement>()

const style = ref({})

const isClosed = computed(() => isSelectionClosed(props.selection))

const color = computed(() => getSelectionColor(props.selection, props.theme))

const render = () => {
  const selectionLength = Math.max(0, props.selection.length - 1)
      const fullLength = (rootRef.value!.clientWidth + rootRef.value!.clientHeight + 2) / 2
      const progress = selectionLength && isClosed.value ? 1 : Math.min(.95, selectionLength / 10)

      style.value = {
        'stroke-dasharray': `${progress * fullLength} ${fullLength}`
      }
}

watch(() => props.selection.length, render)
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-10" ref="rootRef">
    <svg v-for="(corner, $index) in corners" :key="$index" class="absolute will-transform" :style="corner" viewBox="0 0 1 1" preserveAspectRatio="none">
      <polyline
        stroke-width="20"
        class="transition-all duration-200"
        points="1,0 0,0 0,1" height="100" fill="none" :stroke="color"
        vector-effect="non-scaling-stroke"
        :style="style"
      />
    </svg>

    <svg class="absolute w-full h-full will-transform" viewBox="0 0 1 1" preserveAspectRatio="none">
      <rect
        x="0"
        y="0"
        width="1"
        height="1"
        :fill="color"
        class="tranform transition-opacity duration-200"
        :style="{ opacity: selection.length && isClosed ? .15 : 0 }"
      />
    </svg>
  </div>
</template>
