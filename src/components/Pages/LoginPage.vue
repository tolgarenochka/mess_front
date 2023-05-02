<template>
  <div class="login">
    <h1 class="login__title">Log-In Account</h1>
    <form class="login__form" @submit.prevent="login">
      <div class="login__input input-login">
        <input class="input-login__field" autocomplete="off" type="text" required v-model="username">
        <label class="input-login__label">Name</label>
        <div class="input-login__border"></div>
      </div>
      <div class="login__input input-login">
        <input class="input-login__field" autocomplete="off" type="password" required v-model="password">
        <label class="input-login__label">Password</label>
        <div class="input-login__border"></div>
      </div>
      <div v-if="isError" class="login__error">
        Not valid password or login
      </div>
      <button class="login__button" type="submit">Log In</button>
    </form>
  </div>
</template>

<script>
import { api } from "../../api"

export default {
  data() {
    return {
      username: '',
      password: '',
      isError: false
    }
  },
  methods: {
    login() {
      api.post('/auth', { mail: this.username, pas: this.password })
        .then(response => {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('my_name', response.data.full_name);
          localStorage.setItem('my_photo', response.data.photo);
          this.$router.push("/")
        })
        .catch(() => {
          this.isError = true;
          localStorage.removeItem("token");
          localStorage.removeItem("my_name");
          localStorage.removeItem("my_photo");
        })
    }
  }
};
</script>