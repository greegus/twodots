<template>
  <modal-layout class="select-none font-sans font-light" width="420" hide-closer>
    <div class="font-light text-2xl text-center lg:mt-3 mb-3 lg:mb-5">
      Level {{ level.id }}
    </div>

    <div class="flex items-center justify-center">
      <div v-for="(goal, $index) in level.goals" :key="$index" class="text-center">
        <GoalPreview :goal="goal" :theme="level.theme" class="w-8 h-8 m-2" />
        {{ goal.target }}
      </div>
    </div>

    <div class="text-lg text-center mt-5">
      in {{ level.moves }} Moves
    </div>

    <div class="mt-5 lg:mt-10">
      <Button class="w-full" primary @click="$emit('close', true)">
        Let's go
      </Button>
    </div>
  </modal-layout>
</template>

<script>
import GoalPreview from 'components/GoalPreview'

export default {
  components: {
    GoalPreview
  },

  props: {
    level: {
      type: Object,
      required: true
    }
  }
}
</script>
