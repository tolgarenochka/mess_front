<template>
  <aside class="main__aside aside">
    <div class="aside__search search-aside">
      <img class="search-aside__icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png" />
      <input v-model="search" class="search-aside__input" type="text" placeholder="search">
    </div>
    <button class="aside__button" type="button" @click="showModal = true">
      +
    </button>
    <ul class="aside__dialogs">
      <li v-for="item in dialogs" class="aside__dialog dialog-aside" :key="item.id" @click="$emit('clickDialog', item)">
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
  <AddDialog v-if="showModal" @close="showModal = false" />
</template>

<script>
import AddDialog from "./Modals/AddDialog.vue";
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
  }),
  computed: {
    dialogs() {
      if (this.search) {
        return this.dialogsList.filter(item => item.full_name.trim().toLowerCase().includes(this.search.trim().toLowerCase()));
      }
      return this.dialogsList;
    }
  },
};
</script>