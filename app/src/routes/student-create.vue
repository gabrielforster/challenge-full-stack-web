<script setup lang="ts">
import { ref, onMounted } from "vue"
import { RouterLink } from "vue-router"
import { Pencil, Trash } from "lucide-vue-next"
import { api } from "../lib/api"

const search = ref("")
const loading = ref(false)
const proballyNextRa = ref(0)

onMounted(async () => {
  loading.value = true
  const { data } = await api.get("/students/next-ra")
  proballyNextRa.value = data.ra
  loading.value = false
})
</script>

<template>
  <section class="p-4 flex-1">
    <header class="flex items-center justify-between p-4 border-b border-gray-300">
      <h1 class="text-2xl font-bold">Alunos</h1>

      <v-btn variant="tonal">
        Cadastrar aluno
      </v-btn>
    </header>

    <section>
    </section>
  </section>
</template>
