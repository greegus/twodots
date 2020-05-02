<template>
  <modal-layout class="select-none font-sans font-light" width="420" hide-closer>
    <div class="font-light text-2xl text-center lg:mt-3 mb-3 lg:mb-5">
      Level {{ level.id }}
    </div>

    <div class="flex items-center justify-center">
      <div v-for="(goal, $index) in level.goals" :key="$index" class="text-center">
        <TilePreview :tile="goal.tile" :theme="level.theme" class="w-12 h-12 transform scale-110" />
        {{ goal.target }}
      </div>
    </div>

    <div class="text-lg text-center mt-5">
      in {{ level.moves }} Moves
    </div>

    <div class="mt-5 lg:mt-10">
      <Button class="w-full" @click="$emit('close', true)">
        Let's go
      </Button>
    </div>
  </modal-layout>
</template>

<script>
import TilePreview from 'components/TilePreview'

export default {
  components: {
    TilePreview
  },

  props: {
    level: {
      type: Object,
      required: true
    }
  }
}
</script>
