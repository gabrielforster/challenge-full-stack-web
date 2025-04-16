<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Pencil, Trash } from "lucide-vue-next"
import { RouterLink } from "vue-router"
import { api } from "../lib/api"

const search = ref("")
const loading = ref(false)
const students = ref([])

onMounted(async () => {
  loading.value = true
  const { data } = await api.get("/students")
  students.value = data
  loading.value = false
})
</script>

<template>
  <section class="p-4 flex-1">
    <header class="flex items-center justify-between p-4 border-b border-gray-300">
      <h1 class="text-2xl font-bold">Alunos</h1>

      <RouterLink to="/alunos/cadastrar">
        <v-btn variant="tonal">
          Cadastrar aluno
        </v-btn>
      </RouterLink>
    </header>

    <section>
      <v-text-field
        v-model="search"
        label="Pesquisar"
        class="my-4 w-full"
        placeholder="Digite sua busca"
        :disabled="loading"
        :loading="loading"
      />

      <v-table
        fixed-header
      >
        <thead>
          <tr>
            <th class="text-left !font-semibold">
              RA
            </th>
            <th class="text-left !font-semibold">
              Nome
            </th>
            <th class="text-left !font-semibold">
              CPF
            </th>
            <th class="text-center !font-semibold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in students"
            :key="student.ra"
          >
            <td>
              {{ student.ra }}
            </td>
            <td>
              {{ student.name }}
            </td>
            <td>
              {{ student.cpf }}
            </td>
            <td class="flex items-center justify-center gap-2">
              <RouterLink
                :to="`/alunos/${student.ra}/editar`"
                class="text-blue-500 hover:underline"
              >
                <Pencil class="size-5 text-black" />
              </RouterLink>
              <RouterLink
                :to="`/alunos/${student.ra}`"
                class="text-blue-500 hover:underline"
              >
                <Trash class="size-5 text-red-500" />
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </v-table>
    </section>
  </section>
</template>
