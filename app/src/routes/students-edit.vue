<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Pencil, Trash } from "lucide-vue-next"
import { RouterLink, useRouter } from "vue-router"
import { api } from "../lib/api"
import { useToastsStore } from "../stores/toast"

const { add: addToast } = useToastsStore()
const router = useRouter()

const search = ref("")
const loading = ref(true)
const student = ref<{
  ra: string
  name: string
  email: string
  cpf: string
} | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await api.get(`/students/${router.currentRoute.value.params.ra}`)
    student.value = data
  } catch (err) {
    console.error("error while fetching student", err)
  } finally {
    loading.value = false
  }
})

async function onSave () {
  loading.value = true

  try {
    if (!student.value.name || !student.value.email) {
      addToast("Preencha todos os campos!")
      return
    }

    await api.patch("/students", student.value)

    addToast(`Aluno cadastrado com sucesso! ${student.value.name} cadastrado com RA: ${student.value.ra}`)

    router.push("/alunos")
  } catch (err) {
    console.error("error while registering student", err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="p-4 flex-1 flex flex-col">
    <header class="flex items-center justify-between p-4 border-b border-gray-300">
      <h1 class="text-2xl font-bold">
        Editando Aluno
        <span v-if="student">
          {{ student.name }}
        </span>
      </h1>
    </header>

    <section class="flex flex-col flex-1">
      <div v-if="loading" class="flex items-center justify-center flex-1">
        <v-progress-circular
          indeterminate
          color="blue"
        />
      </div>

      <div v-else-if="student === null" class="flex items-center justify-center flex-1 h-full">
        <v-alert
          type="error"
          class="my-4"
        >
          Aluno não encontrado
        </v-alert>
      </div>

      <div v-else>
        <v-text-field
          v-model="student.ra"
          label="RA"
          class="my-4 w-full"
          disabled
        />

        <v-text-field
          v-model="student.name"
          label="Nome"
          class="my-4 w-full"
          placeholder="Digite o nome do aluno"
          :disabled="loading"
        />

        <v-text-field
          v-model="student.email"
          label="Email"
          class="my-4 w-full"
          placeholder="Digite o email do aluno"
          :disabled="loading"
        />

        <v-text-field
          v-model="student.cpf"
          label="CPF"
          class="my-4 w-full"
          placeholder="Digite o CPF do aluno"
          disabled
        />
      </div>

      <footer v-show="!loading" class="flex-1 space-x-2 flex items-end justify-end">
        <v-btn variant="tonal">
          <RouterLink to="/alunos">
            Cancelar
          </RouterLink>
        </v-btn>

        <v-btn class="!bg-blue-500 text-white" @click="onSave">
          Salvar
        </v-btn>
      </footer>
    </section>
  </section>
</template>
