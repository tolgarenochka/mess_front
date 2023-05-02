<template>
    <h2>Log-In Account</h2>
    <div class="card">

    <form>
        <div class="input-border">
            <input autocomplete="off" type="text" class="text" required v-model="username">
            <label>Name</label>
            <div class="border"></div>
        </div>
 
        <div class="input-border">
            <input autocomplete="off" type="password" class="text" required v-model="password">
            <label>Password</label>
            <div class="border"></div>
        </div>
        <div class="error" v-if="isError">
                Not valid password or login
        </div>
        <input type="submit" class="btn" value="Log In" @click.prevent="login()">

        </form>
    </div>

</template>

<script>
import {api} from "../api"

export default {
  data(){
   return{
	username:'',
	password:'',
    isError: false
   }
  },
  methods:{
   login(){
    api.post('/auth', {mail: this.username, pas: this.password})
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

<style>
*{
padding: 0;
margin: 0;
outline: none;
font-family: sans-serif;
}

body{
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.error{
text-align: center;
color: rgb(221, 83, 83);
font-size: 16px;
font-weight: 500;
margin-bottom: 15px;
}

.card{
width: 380px;
padding: 20px;
border-radius: 6px;
box-shadow: 0 0 8px silver;
background: #5e616a;
}

h2{
color: white;
text-align: center;
}

.input-border{
width: 100%;
height: 40px;
position: relative;
margin-bottom: 30px;
}

.text{
width: 95%;
height: 100%;
padding: 0 10px;
border: none;
border-bottom: 2px solid silver;
background: none;
font-size: 18px;
color: #abd9e9;
}

.border{
position: absolute;
bottom: 0;
left: 0;
width: 0;
height: 2px;
background: white;
transition: .5s;
}

.text:focus ~ .border,
.text:valid ~ .border{
width: 100%;
}

label{
position: absolute;
top: 8px;
left: 14px;
color: silver;
pointer-events: none;
font-size: 18px;
transition: .5s;
}

.text:focus ~ label,
.text:valid ~ label{
top: -12px;
left: 0;
color: white;
font-size: 14px;
}

.btn{
width: 100%;
height: 50px;
border-radius: 8px;
background: none;
border: 2px solid silver;
color: white;
font-size: 18px;
transition: .5s;
}

.btn:hover{
border: 2px solid white;
}
</style>
