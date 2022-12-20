<script setup>
// imports

import { ref, onMounted } from "vue";

// variables & constants

const chessComUsernameKey = "profile.chesscom.username";
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

const ccUsername = ref(localStorage.getItem(chessComUsernameKey) || "");
const liUsername = ref(localStorage.getItem(lichessUsernameKey) || "");

const emit = defineEmits(["gamesLoaded"]);

// methods

async function getInsights() {
  localStorage.setItem(chessComUsernameKey, ccUsername.value);
  localStorage.setItem(lichessUsernameKey, liUsername.value);
  const games = await backend.getGames(
    { chessComUsername: ccUsername.value, lichessUsername: liUsername.value },
    gamesToLoad
  );
  emit("gamesLoaded", games);
}

// lifecycle hooks

onMounted(() => {
  backend = props.backend;
});
</script>

<template>
  <h4 class="input">
    <label>Game insights for: </label>
    <label
      >chess.com
      <input
        v-model="ccUsername"
        class="username"
        type="text"
        title="chess.com username"
      />
    </label>
    <label
      >lichess
      <input
        v-model="liUsername"
        class="username"
        type="text"
        title="lichess.org username"
    /></label>
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
.username {
  max-width: 80pt;
  margin: 0px;
}
</style>
