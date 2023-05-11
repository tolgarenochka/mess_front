<template>
  <div class="modal">
    <div class="modal__container">
      <div class="modal__title">
        Добавление диалога
      </div>
      <div class="aside__search search-aside">
        <img class="search-aside__icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png" />
        <input v-model="search" class="search-aside__input" type="text" placeholder="search">
      </div>
      <ul class="modal__list">
        <li v-for="item in persons" :key="item.id" class="modal__person">
          <div class="modal__text">{{ item.full_name }}</div>
          <button class="modal__plus" @click="Create(item.id, item.full_name, item.photo)">
            +
          </button>
        </li>
      </ul>
      <div class="modal__buttons">
        <button class="modal__button white" @click="$emit('close')">
          Отменить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../../api"
export default {
  props: {
    persons_list: {
      type: Array,
      default: () => []
    }, 
    show_modal: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    search: '',
  }),
  computed: {
    persons() {
      if (this.search) {
        return this.persons_list.filter(item => (item.full_name).replace(" ", '').toLowerCase().includes(this.search.replace(" ", '').toLowerCase()));
      }
      return this.persons_list;
    }
  }, 
  methods: {
    Create(id, name, photo) {
      this.$emit("getPerson", id, name, photo);
    }, 
    getUserInfo() {
      this.showModal = true;

      api.get('/usersList')
        .then((res) => {
          this.persons = res.data;
        })
    }
  }
};
</script>