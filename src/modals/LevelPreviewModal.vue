<template>
  <modal-layout class="select-none font-sans font-light" hide-closer>
    <div class="font-light text-5xl text-center mb-5">
      Level {{ level.id }}
    </div>

    <div class="flex items-center justify-center">
      <div v-for="(goal, $index) in level.goals" :key="$index">
        <GoalItem :goal="goal" :theme="level.theme" />
      </div>
    </div>

    <div class="text-lg text-center mt-3">
      in {{ level.moves }} Moves
    </div>

    <div class="pt-5 mt-5">
      <Button class="w-full" @click="$emit('close', true)">
        Let's go
      </Button>
    </div>
  </modal-layout>
</template>

<script>
import GoalItem from 'components/GoalItem'

export default {
  components: {
    GoalItem
  },

  props: {
    level: {
      type: Object,
      required: true
    }
  }
}
</script>
