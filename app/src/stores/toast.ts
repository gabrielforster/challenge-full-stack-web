import { ref } from "vue"
import { defineStore } from "pinia"

export const useToastsStore = defineStore("messages", () => {
  const queue = ref<string[]>([])

  function add (message: string) {
    queue.value.push(message)
  }

  return { queue, add }
})
