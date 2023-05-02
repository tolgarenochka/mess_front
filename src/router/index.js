import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/Pages/LoginPage";
import Home from "../components/Pages/MainPage";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;