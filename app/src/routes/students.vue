<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Pencil, Trash, RefreshCw } from "lucide-vue-next"
import { RouterLink } from "vue-router"
import { api } from "../lib/api"

const search = ref("")
const loading = ref(false)
const students = ref([])
const dialog = ref(false)
const loadingDialogConfirm = ref(false)

onMounted(async () => {
  await fetchStundents()
})

async function fetchStundents () {
  loading.value = true
  try {
    const { data } = await api.get("/students")
    students.value = data
  } catch (err) {
    console.error("error while fetching students", err)
  } finally {
    loading.value = false
  }
}

async function deleteStudent (ra: string) {
  loadingDialogConfirm.value = true

  try {
    await api.delete(`/students/${ra}`)
    await fetchStundents()
    dialog.value = false
  } catch (err) {
    console.error("error while deleting student", err)
  } finally {
    loadingDialogConfirm.value = false
  }
}
</script>

<template>
  <section class="p-4 flex-1">
    <header class="flex items-center justify-between p-4 border-b border-gray-300">
      <h1 class="text-2xl font-bold">Alunos</h1>

      <div class="space-x-2">
        <v-btn @click="fetchStundents">
          <RefreshCw class="size-5" />
        </v-btn>

        <RouterLink to="/alunos/cadastrar">
          <v-btn variant="tonal">
            Cadastrar aluno
          </v-btn>
        </RouterLink>
      </div>
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

      <div v-if="loading" class="flex items-center justify-center flex-1">
        <v-progress-circular
          indeterminate
          color="blue"
        />
      </div>

      <div v-else-if="students.length === 0" class="flex items-center justify-center flex-1 h-full">
        <v-alert
          type="info"
          class="my-4"
        >
          Nenhum aluno encontrado
        </v-alert>
      </div>

      <v-table v-else fixed-header>
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

              <v-dialog
                v-model="dialog"
                max-width="400"
                persistent
              >
                <template v-slot:activator="{ props: activatorProps }">
                  <Trash
                    v-bind="activatorProps"
                    class="size-5 text-red-500 hover:cursor-pointer"
                  />
                </template>

                <v-card
                  prepend-icon="mdi-map-marker"
                  title="Deseja mesmo excluir esse aluno?"
                  :text="`Isso fará com que os dados sejam mantidos, mas o aluno não terá mais acesso ao sistema.`"
                >
                  <template v-slot:actions>
                    <v-spacer></v-spacer>

                    <v-btn @click="dialog = false">
                      Cancelar
                    </v-btn>

                    <v-btn @click="() => deleteStudent(student.ra)" :disabled="loadingDialogConfirm">
                      <v-progress-circular
                        v-if="loadingDialogConfirm"
                        indeterminate
                        color="blue"
                      />

                     <span v-else>
                        Confirmar
                      </span>
                    </v-btn>
                  </template>
                </v-card>
              </v-dialog>
            </td>
          </tr>
        </tbody>
      </v-table>
    </section>
  </section>
</template>
