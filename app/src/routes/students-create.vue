<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Pencil, Trash } from "lucide-vue-next"
import { RouterLink, useRouter } from "vue-router"
import { api } from "../lib/api"
import { useToastsStore } from "../stores/toast"

const { add: addToast } = useToastsStore()
const router = useRouter()

const search = ref("")
const loading = ref(false)

const ra = ref(0)
const name = ref("")
const email = ref("")
const cpf = ref("")
const birthDate = ref("")

onMounted(async () => {
  loading.value = true
  const { data } = await api.get("/students/next-ra")
  ra.value = data.ra
  loading.value = false
})

async function onRegister () {
  loading.value = true

  try {
    if (!name.value || !email.value || !cpf.value) {
      addToast("Preencha todos os campos!")
      return
    }

    if (!/^[0-9]{11}$/.test(cpf.value)) {
      addToast("CPF inválido")
      return
    }

    if (new Date() < new Date(birthDate.value)) {
      addToast("Data de nascimento inválida")
      return
    }


    const { data } = await api.post("/students", {
      ra: ra.value,
      name: name.value,
      email: email.value,
      cpf: cpf.value,
      birthDate: birthDate.value,
    })

    if (data) {
      name.value = ""
      email.value = ""
      cpf.value = ""
      birthDate.value = ""

      addToast(`Aluno cadastrado com sucesso! ${data.name} cadastrado com RA: ${data.ra}`)

      router.push("/alunos")
    }
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
      <h1 class="text-2xl font-bold">Cadastrar Aluno</h1>
    </header>

    <section class="flex flex-col flex-1">
      <div>
        <v-text-field
          v-model="ra"
          label="RA"
          class="my-4 w-full"
          disabled
        />

        <v-text-field
          v-model="name"
          label="Nome"
          class="my-4 w-full"
          placeholder="Digite o nome do aluno"
          :disabled="loading"
        />

        <v-text-field
          v-model="email"
          label="Email"
          class="my-4 w-full"
          placeholder="Digite o email do aluno"
          :disabled="loading"
        />

        <v-text-field
          v-model="cpf"
          label="CPF"
          class="my-4 w-full"
          placeholder="Digite o CPF do aluno"
          :disabled="loading"
        />

        <v-text-field
          v-model="birthDate"
          label="Data de nascimento do aluno"
          type="date"
        />
      </div>

      <footer class="flex-1 space-x-2 flex items-end justify-end">
        <v-btn variant="tonal">
          <RouterLink to="/alunos">
            Cancelar
          </RouterLink>
        </v-btn>

        <v-btn class="!bg-blue-500 text-white" @click="onRegister">
          Cadastrar
        </v-btn>
      </footer>
    </section>
  </section>
</template>
