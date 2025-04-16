import { createApp } from "vue"
import { createPinia } from "pinia"
import { createRouter, createWebHistory } from "vue-router"
import "./style.css"
import App from "./App.vue"

import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

import Home from "./routes/home.vue"
import Students from "./routes/students.vue"
import StudentsCreate from "./routes/students-create.vue"

const vuetify = createVuetify({
  components,
  directives,
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/alunos", component: Students },
    { path: "/alunos/cadastrar", component: StudentsCreate },
  ]
})

const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .mount("#app")
