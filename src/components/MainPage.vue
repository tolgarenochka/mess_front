<template>
    <div id="container">
        <header>
            <div id="info"> 
                <div id="profile">
                    <img ref="userAvatar">
                </div>
                <div id="my_name">{{ full_name }}</div>
                <img id="exit" src="https://img.icons8.com/pulsar-color/96/null/exit.png" alt="Выход" @click="logout()">
            </div>
        </header>
      <aside>
          <header>
              <input type="text" placeholder="search">
          </header>
          <ul>
              <li v-for="item in list" :key="item.id" @click="clickHandler(item)">
                  <img :src="'data:image/gif;base64,' + item.friend_photo">
                  <div>
                      <h2>{{ item.full_name }}</h2>
                      <h3 v-if="item.are_you_last_mes_sender">
                          Вы: {{ item.last_mes.slice(0, 35) }}...
                      </h3>
                      <h3 v-else>
                        <span v-if="!item.is_read" class="status green"></span>
                          {{ item.last_mes }}
                      </h3>
                  </div>
              </li>
          </ul>
      </aside>
      <main v-if="$route.query.dialogId">
          <header>
              <div>
                  <h2>{{this.currentCompanion.full_name}}</h2>
              </div>
          </header>
          <ul id="chat">
              <li :class="message.am_i_sender ? 'me' : 'you'" v-for="message in messagesList" :key="message.id">
                  <div class="entete">
                      <h3>{{ message.time.split('T')[0].split('-').reverse().join('.') }}</h3>
                  </div>
                  <div class="triangle"></div>
                  <div class="message">
                      {{ message.text }}
                  </div>
              </li>
          </ul>
          <footer>
              <textarea placeholder="Type your message" v-model="mes_text" @keyup.enter.exact.prevent="sendMessage()"
              @keydown.enter.shift.exact.prevent="mes_text += '\n'"
              ></textarea>
              <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_picture.png" alt="">
              <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_file.png" alt="">
              <a href="#" @click="sendMessage()" >Send</a>
          </footer>
      </main>
      <main v-else>
        <div id="select_dialog">Select dialog...</div>
      </main>
  </div>
  </template>
  
  <script>
import {api} from "../api"

    export default {
  data(){
   return{
	username:'',
	password:'',
    list: [],
    messagesList: [],
    currentCompanion: {},
    full_name:'',
    friend_name:'',
    isError:false,
    mes_text:''
   }
  },
  created(){
    if (!localStorage.getItem('token')) {
      return this.$router.push('/login');
    }
  },
  mounted: function() {
      this.getDialogs() // Calls the method before page loads
      if (this.$route.query.dialogId) {
        this.getMessages();
        this.searchCompanion(this.$route.query.dialogId);
      }
      this.getPhoto();
      this.getFullName();
  },
  watch: {
    "$route"() {
        this.getMessages();
        this.searchCompanion(this.$route.query.dialogId);
    }
  },
    methods:{
    getPhoto(){
        this.$refs.userAvatar.src = `data:image/gif;base64,${localStorage.getItem("my_photo")}`;
    },
    getFullName(){
        this.full_name = localStorage.getItem("my_name");
    },
    getDialogs(){
        api.get('/dialogList')
        .then((res) => {
            this.list = res.data;
            this.friend_name = this.list.full_name;
        })
    },
   getMessages() {
        api.post('/mesList', {dialog_id: +this.$route.query.dialogId})
            .then((res) => {
                this.messagesList = res.data;
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
    return new Date();
  },
   sendMessage() {
        if ((this.mes_text != "\n") && (this.mes_text != " ") && (this.mes_text != "")) {
        api.post('/sendMes', {dialog_id: +this.$route.query.dialogId, text: this.mes_text, send_time: this.getTime()})
            .then(() => {
                this.mes_text = ""
            })
        }
   }, 
   logout(){
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
  
  <style>
  *{
      box-sizing:border-box;
  }
  body{
      background-color:#abd9e9;
      font-family:Arial;
  }
  #info{
    width:1400px;
    height:75px;
    background-color:#fff;
    display: flex;
    flex-direction: row-reverse;
  }
  #profile{
    width:60px;
    height:60px;
    position:relative; 
    margin-right: 10px;
  }
  #profile img{
    border-radius:50%;
    position:relative; 
    width:55px;
    height:55px;
    margin-top: 10px;
    cursor:pointer;
  }
  #my_name{
    text-align: center;
    font-size:16px;
    color:#7e818a;
    font-weight:normal;
    margin-top: 30px;
    margin-right: 20px;
    cursor:pointer;
  }
  #exit{
    position:relative; 
    width:30px;
    height:30px;
    margin-top:23px;
    margin-right:20px;
    cursor:pointer;
  }
  #container{
      width:1400px;
      height:80%;
      background:#eff3f7;
      margin:0 auto;
      font-size:0;
      border-radius:5px;
      overflow:hidden;
  }
  aside{
      width:360px;
      height:700px;
      background-color:#3b3e49;
      display:inline-block;
      font-size:15px;
      vertical-align:top;
  }
  main{
      width:1000px;
      height:700px;
      display:inline-block;
      font-size:15px;
      vertical-align:top;
  }
  
  aside header{
      padding:30px 20px;
  }
  aside input{
      width:100%;
      height:50px;
      line-height:50px;
      padding:0 50px 0 20px;
      background-color:#5e616a;
      border:none;
      border-radius:3px;
      color:#fff;
      background-image:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png);
      background-repeat:no-repeat;
      background-position:170px;
      background-size:40px;
  }
  aside input::placeholder{
      color:#fff;
  }
  aside ul{
      padding-left:0;
      margin:0;
      list-style-type:none;
      overflow-y:scroll;
      height:690px;
  }
  aside li{
      padding:10px 0;
  }
  aside li:hover{
      background-color:#5e616a;
  }
  h2,h3{
      margin:10px;
  }
  aside li img{
      border-radius:50%;
      margin-left:20px;
      margin-right:8px;
      margin-top:8px;
      width:55px;
      height:55px;
  }
  aside li div{
      display:inline-block;
      vertical-align:top;
      margin-top:12px;
  }
  aside li h2{
      font-size:14px;
      color:#fff;
      font-weight:normal;
      margin-bottom:5px;
      text-align: left;
  }
  aside li h3{
      font-size:12px;
      color:#7e818a;
      font-weight:normal;
  }
  
  .status{
      width:8px;
      height:8px;
      border-radius:50%;
      display:inline-block;
      margin-right:7px;
  }
  .green{
      background-color:#58b666;
  }
  
  main header{
      height:60px;
      /* padding:30px 20px 30px 40px; */
  }
  main header > *{
      display:inline-block;
      vertical-align:top;
  }
  main header img:first-child{
      border-radius:50%;
  }
  main header img:last-child{
      width:24px;
      margin-top:8px;
  }
  main header div{
      margin-left:10px;
      margin-right:145px;
  }
  main header h2{
      font-size:16px;
      margin-bottom:5px;
      color:#3b3e49
  }
  main header h3{
      font-size:14px;
      font-weight:normal;
      color:#7e818a;
  }
  #select_dialog{
      font-size:16px;
      font-weight:normal;
      color:#7e818a;
      text-align:center;
      margin-top:30%;
      margin-left:10%;
  }
  #chat{
      padding-left:0;
      margin:0;
      list-style-type:none;
      overflow-y:auto;
      height:490px;
      border-top:2px solid #fff;
      border-bottom:2px solid #fff;
  }
  #chat li{
      padding:10px 30px;
  }
  #chat h2,#chat h3{
      display:inline-block;
      font-size:13px;
      font-weight:normal;
  }
  #chat h3{
      color:#bbb;
  }
  #chat .entete{
      margin-bottom:5px;
  }
  #chat .message{
      padding:20px;
      color:#fff;
      line-height:25px;
      max-width:90%;
      display:inline-block;
      text-align:left;
      border-radius:5px;
  }
  #chat .me{
      text-align:right;
  }
  #chat .you .message{
      background-color:#58b666;
  }
  #chat .me .message{
      background-color:#6fbced;
  }
  #chat .triangle{
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 10px 10px 10px;
  }
  #chat .you .triangle{
          border-color: transparent transparent #58b666 transparent;
          margin-left:15px;
  }
  #chat .me .triangle{
          border-color: transparent transparent #6fbced transparent;
          margin-left:900px;
  }
  
  main footer{
      height:155px;
      padding:20px 30px 10px 20px;
  }
  main footer textarea{
      resize:none;
      border:none;
      display:block;
      width:100%;
      height:80px;
      border-radius:3px;
      padding:20px;
      font-size:13px;
      margin-bottom:13px;
  }
  main footer textarea::placeholder{
      color:#ddd;
  }
  main footer img{
      height:30px;
      cursor:pointer;
  }
  main footer a{
      text-decoration:none;
      text-transform:uppercase;
      font-weight:bold;
      color:#6fbced;
      vertical-align:top;
      margin-left:900px;
      margin-top:5px;
      display:inline-block;
  }
  </style>
  