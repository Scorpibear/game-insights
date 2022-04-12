<script setup>

import {ref} from 'vue'

let username = localStorage.getItem('user.lichess.username') || "";

function getInsights() {
  console.log(username);
}

</script>

<template>
  <h1>Game Insights</h1>
  <div>Lichess.org username: 
    <input id="username"  type="text" v-model="username"/>
    <button @click="getInsights">Get Insights</button>
  </div>
</template>