<template>
    <div class="modal">
        <div class="modal-container">
            <div class="title">
                Создание диалога
            </div>
            <div class="search">
                <img class="search-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png" />
                <input v-model="search" class="search-input" type="text" placeholder="search">
            </div>
            <ul>
                <li v-for="item in persons" :key="item.id">
                    <div>
                        <h2>{{ item.full_name }}</h2>
                        <h2>+</h2>
                    </div>
                </li>
            </ul>
            <div class="buttons">
                <button class="button" @click="$emit('close')">
                    Отменить
                </button>
                <button class="button" @click="create">
                    Создать
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data(){
   return{
    persons: [{id: 1, full_name: 'name 1'}],
   }
  },
  methods: {
    create() {
        console.log('тут логика создания');
    }
  }
};
</script>

<style>
.search-input {
    flex: 1 1 auto;
    background: transparent;
    border: 0;
    color: #fff;
}
.modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #8f8d8d;
}

.modal-container {
    width: 500px;
    padding: 20px;
    border-radius: 40px;
    background: #fff;
}
</style>