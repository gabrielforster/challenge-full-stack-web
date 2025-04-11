<script setup lang="ts">
import { ref } from "vue"

defineProps<{ msg: string }>()

const count = ref(0)
const increment = () => {
  count.value++
}
</script>

<template>
  <h1 class="text-xl">Hi from Vue app</h1>
  <v-btn
    color="primary"
    rounded="xl"
    class="bg-blue-500 text-white"
    @click="increment"
  >
    {{ count }}
  </v-btn>
</template>
