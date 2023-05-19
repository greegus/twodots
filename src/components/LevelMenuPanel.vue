<template>
  <div class="LevelMenuPanelm overflow-hidden">
    <FadeTransition>
      <div class="fixed inset-0 z-10 bg-black bg-opacity-25" @pointerdown="close()" v-if="isOpen"></div>
    </FadeTransition>

    <SlideFromSide>
      <div class="fixed inset-y-0 right-0 z-10 flex flex-col max-w-md bg-spaceblue-700 rounded-l-2xl"
        style="width: calc(100% - 3rem)" v-if="isOpen">
        <div class="rounded-tl-2xl bg-spaceblue-800 p-5 text-white">
          <Logo />
        </div>

        <div class="p-5">
          <Button class="w-full mb-5" variant="primary" @click="close(); $emit('restart-level')">
            Restart
          </Button>

          <Button class="w-full mb-5" variant="secondary" @click="close(); $emit('exit-to-map')">
            Exit to map
          </Button>
        </div>
      </div>
    </SlideFromSide>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Button, useOnKeyPress } from 'vuiii'

import Logo from '@/components/Logo.vue'

import SlideFromSide from '@/transitions/SlideFromSideTransition.vue'
import FadeTransition from '@/transitions/FadeTransition.vue'

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

useOnKeyPress('Escape', () => close())

defineExpose({
  open, 
  close
})
</script>