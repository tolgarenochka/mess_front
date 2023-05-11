<template>
  <aside class="main__aside aside">
    <div class="aside__search search-aside">
      <img class="search-aside__icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png" />
      <input v-model="search" class="search-aside__input" type="text" placeholder="search">
    </div>
    <button class="aside__button" type="button" @click="getUsers">
      +
    </button>
    <ul class="aside__dialogs">
      <li v-for="item in dialogs.sort(function(a, b) {return a.time - b.time;})" class="aside__dialog dialog-aside" :key="item.last_mes_text" @click="$emit('clickDialog', item)">
        <img class="dialog-aside__avatar" :src="item.friend_photo">
        <div class="dialog-aside__info">
          <div class="dialog-aside__name">{{ item.full_name }}</div>
          <div v-if="item.are_you_last_mes_sender" class="dialog-aside__message">
            Вы: {{ item.last_mes }}
          </div>
          <div v-else class="dialog-aside__message">
            <div v-if="!item.is_read" class="dialog-aside__status green"></div>
            {{ item.last_mes }}
          </div>
        </div>
      </li>
    </ul>
  </aside>
  <AddDialog @getPerson="GetPerson" :persons_list="persons" :show_modal="showModal" v-if="showModal" @close="showModal = false" />
</template>

<script>
import AddDialog from "./Modals/AddDialog.vue";
import { api } from "../api"
export default {
  components: { AddDialog },
  props: {
    dialogsList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    search: '',
    showModal: false,
    persons: []
  }),
  computed: {
    dialogs() {
      if (this.search) {
        return [...this.dialogsList.filter(item => item.full_name.trim().toLowerCase().includes(this.search.trim().toLowerCase()))].sort(function(a, b) {
        if (b.time < a.time) {
        return -1;
        }
      if (b.time > a.time) {
        return 1;
        }
      })
      }
      return [...this.dialogsList].sort(function(a, b) {
        if (b.time < a.time) {
        return -1;
        }
      if (b.time > a.time) {
        return 1;
        }
      })
    }
  },
  methods: {
    getUsers() {
      this.showModal = true;

      api.get('/usersList')
        .then((res) => {
          this.persons = res.data;
        })
    },
    GetPerson(friend_id, friend_full_name, friend_photo) {
      this.showModal = false;
      
      this.$emit("addPerson", friend_id, friend_full_name, friend_photo);

    }
  }, 
};
</script>