<script setup lang="ts">
import { defineComponent } from "vue"
import { RouterLink, RouterView } from "vue-router"
import { Home, Users, Book } from "lucide-vue-next"

const routes = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/alunos", label: "Alunos", icon: Users },
]
</script>

<template>
  <main class="flex min-h-screen bg-gray-100">
    <aside class="flex flex-col w-1/5 min-h-screen border-r border-gray-300 bg-white text-center p-4">
      <h1 class="text-2xl font-bold">Grupo A</h1>

      <h3>Módulo Acadêmico</h3>

      <nav class="p-4">
        <ul>
          <li v-for="route in routes" :key="route.path">
            <RouterLink
              :to="route.path"
              class="flex items-center p-2 my-1 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg"
              :class="{
                'bg-gray-100 text-gray-900': $route.path === route.path,
              }"
            >
              <component
                :is="route.icon"
                class="size-5 mr-3 text-black"
              />
              {{ route.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <RouterView />
  </main>
</template>
