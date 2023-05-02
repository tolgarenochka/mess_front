<template>
  <header class="main__header header">
    <img class="header__logout" src="https://img.icons8.com/pulsar-color/96/null/exit.png" alt="Выход"
      @click="$emit('logout')">
    <div class="header__name">{{ fullName }}</div>
    <div class="header__avatar">
      <img :src="my_photo">
    </div>
  </header>
</template>

<script>
export default {
  props: {
    myPhoto: {
      type: String,
      default: ''
    },
    fullName: {
      type: String,
      default: ''
    }
  }
};
</script>