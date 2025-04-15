import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import "./style.css"
import App from "./App.vue"

import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

import Home from "./routes/home.vue"
import Students from "./routes/students.vue"

const vuetify = createVuetify({
  components,
  directives,
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/alunos", component: Students },
    { path: "/estudantes", component: Students },
  ]
})

createApp(App)
  .use(vuetify)
  .use(router)
  .mount("#app")
