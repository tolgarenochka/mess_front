<template>
  <div class="main">
    <Header :my-photo="my_photo" :fullName="full_name" @logout="logout" />
    <Aside :dialogs-list="list" :fullName="full_name" @searchDialogs="searchDialogs" @clickDialog="clickHandler" />
    <main v-if="$route.query.dialogId" class="chat">
      <div class="chat__header">
        {{ this.currentCompanion.full_name }}
      </div>
      <ul ref="messagesList" class="chat__messages">
        <li class="chat__message" :class="message.am_i_sender ? 'me' : 'you'" v-for="message in messagesList"
          :key="message.time">
          <div class="chat_time">
            {{ generateDate(message.time) }}
          </div>
          <div class="chat__triangle"></div>
          <div class="chat__text">
            {{ message.text }}
          </div>
        </li>
      </ul>
      <div class="chat__sender sender-chat">
        <textarea class="sender-chat__text" placeholder="Type your message" v-model="mes_text"
          @keyup.enter.exact.prevent="sendMessage()" autofocus></textarea>
        <!-- <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_picture.png" alt=""> -->
        <!-- <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_file.png" alt=""> -->
        <button class="sender-chat__button" type="button" @click="sendMessage()">Send</button>
      </div>
    </main>
    <main v-else class="chat">
      <div class="chat__empty">Select dialog...</div>
    </main>
  </div>
</template>
  
<script>
import { api } from "../../api"
import Header from "../Header.vue";
import Aside from "../Aside.vue";

export default {
  components: { Header, Aside },
  data() {
    return {
      list: [],
      messagesList: [],
      currentCompanion: {},
      full_name: '',
      friend_name: '',
      isError: false,
      mes_text: '',
      connection: null,
      my_photo: '',
    }
  },
  created() {
    if (!localStorage.getItem('token')) {
      return this.$router.push('/login');
    }
  },
  mounted() {
    this.getDialogs();
    this.getPhoto();
    this.getFullName();

    this.connection = new WebSocket("ws://127.0.0.1:8081");
    this.connection.onmessage = function (event) {
      console.log(event);
    }
    this.connection.onopen = function (event) {
      console.log(event);
    }
  },
  watch: {
    "$route"() {
      this.getMessages();
      this.searchCompanion(this.$route.query.dialogId);
    },
  },
  methods: {
    getPhoto() {
      var photo = localStorage.getItem("my_photo");
      if (photo === "") {
        photo = 'user_photo/default.png';
      }
      this.my_photo = photo;
    },
    getFullName() {
      this.full_name = localStorage.getItem("my_name");
    },
    getDialogs() {
      api.get('/dialogList')
        .then((res) => {
          this.list = res.data;
          this.friend_name = this.list.full_name;
        })
    },
    getMessages() {
      api.post('/mesList', { dialog_id: +this.$route.query.dialogId })
        .then((res) => {
          this.messagesList = res.data;
          this.$nextTick(() => {
            this.$refs.messagesList.scrollTo(0, this.$refs.messagesList.scrollHeight);
          })
        })
    },
    clickHandler(item) {
      this.$router.replace({ path: this.$route.path, query: { dialogId: item.id } });
      this.currentCompanion = item;
      this.friend_name = item.full_name;
    },
    searchCompanion(id) {
      this.currentCompanion = this.list.find(item => item.id == id);
    },
    getTime() {
      return new Date().toISOString();
    },
    generateDate(time) {
      const splitted = time.split('T');
      return `${splitted[1].split('Z')[0].split('.')[0]} ${splitted[0].split('-').reverse().join('.')}`
    },
    sendMessage() {
      var dialog = +this.$route.query.dialogId;
      var txt = this.mes_text;
      this.mes_text = "";
      var time = this.getTime();
      this.messagesList.push({ id: 0, time: time, text: txt, am_i_sender: true, files: [{ "path": "path", "name": "name" }] });
      this.list[this.list.findIndex(item => item.id === dialog)].last_mes = txt;
      this.$nextTick(() => {
        this.$refs.messagesList.scrollTo(0, this.$refs.messagesList.scrollHeight);
      });
      var to_send = { event: "SendMessage", token: localStorage.getItem('token'), message_data: { dialog_id: dialog, text: txt, send_time: time } };
      this.connection.send(JSON.stringify(to_send));
    },
    readDialog() {
      var dialog = +this.$route.query.dialogId;
      this.list[this.list.findIndex(item => item.id === dialog)].is_read = false;

      var to_send = { event: "ReadDialog", token: localStorage.getItem('token'), dialog_id: dialog };
      this.connection.send(JSON.stringify(to_send));
    },
    logout() {
      api.post('/logout')
        .then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("my_name");
          localStorage.removeItem("my_photo");
          this.$router.push("/login")
        })
    }
  }
};
</script>
  