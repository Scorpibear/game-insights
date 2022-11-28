<script setup>
// imports

import { ref, onMounted } from "vue";

// variables & constants

const lichessUsernameKey = "profile.lichess.username";
const gamesToLoad = 5;
let backend;

// vue.js definitions

const props = defineProps({
  backend: {
    type: Object,
    required: true,
  },
});

const username = ref(localStorage.getItem(lichessUsernameKey) || "");

const emit = defineEmits(["gamesLoaded"]);

// methods

async function getInsights() {
  localStorage.setItem(lichessUsernameKey, username.value);
  const games = await backend.getGames(username.value, gamesToLoad);
  emit("gamesLoaded", games, username.value);
}

// lifecycle hooks

onMounted(() => {
  backend = props.backend;
});
</script>

<template>
  <h4 class="input">
    <label>Game insights for: </label>
    <input
      id="username"
      v-model="username"
      type="text"
      title="lichess username"
    />
    <button @click="getInsights">Get!</button>
  </h4>
</template>

<style scoped>
.input {
  display: flex;
  justify-content: center;
}
label {
  margin-right: 5pt;
}
#username {
  max-width: 120pt;
  margin: 0px;
}
</style>
