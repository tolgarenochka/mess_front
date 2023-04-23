import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/LogPage";
import Home from "../components/MainPage";


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

// router.beforeEach((data) => {
//   const {next, router} = data;
//   if (!localStorage.getItem('token')) {
//     console.log("eurwfdhsjkvfr")
//     next()
//   return router.push({ name: 'login' });
//   }
//   next()
// })

export default router;