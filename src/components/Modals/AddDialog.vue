<template>
  <div class="modal">
    <div class="modal__container">
      <div class="modal__title">
        Создание диалога
      </div>
      <div class="aside__search search-aside">
        <img class="search-aside__icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png" />
        <input v-model="search" class="search-aside__input" type="text" placeholder="search">
      </div>
      <li v-for="item in persons_list" :key="item.id">
        <div class="modal__text"> {{ item.second_name }} {{ item.first_name }} {{ item.third_name }}</div>
      </li>
      <div class="modal__buttons">
        <button class="modal__button white" @click="$emit('close')">
          Отменить
        </button>
        <button class="modal__button blue" @click="create">
          Создать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    persons_list: {
      type: Array,
      default: () => []
    }
  }
};
</script>