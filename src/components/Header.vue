<script setup>

const lichessUsernameKey = "profile.lichess.username";

import {ref, onMounted} from 'vue'

const username = ref(localStorage.getItem(lichessUsernameKey) || "");

function getInsights() {
  console.log(username.value);
  localStorage.setItem(lichessUsernameKey, username.value);
}

onMounted(() => {
})

</script>

export default {
  data() {
    return {
      username;
    }
  }
}

<template>
  <h1>Game Insights</h1>
  <div>Lichess.org username: 
    <input id="username"  type="text" v-model="username"/>
    <button @click="getInsights">Get Insights</button>
  </div>
</template>