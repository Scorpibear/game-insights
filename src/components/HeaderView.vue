<script setup>
// imports

import { ref, onMounted } from "vue";

// variables & constants

const chessComUsernameKey = "profile.chesscom.username";
const lichessUsernameKey = "profile.lichess.username";
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
const gamesToLoad = ref(5);

const emit = defineEmits(["gamesLoaded"]);

// methods

async function getInsights() {
  localStorage.setItem(chessComUsernameKey, ccUsername.value);
  localStorage.setItem(lichessUsernameKey, liUsername.value);
  const games = await backend.getGames(
    { chessComUsername: ccUsername.value, lichessUsername: liUsername.value },
    gamesToLoad.value
  );
  emit("gamesLoaded", games);
}

// lifecycle hooks

onMounted(() => {
  backend = props.backend;
});
</script>

<template>
  <div class="input">
    <label
      >Games
      <input
        id="games-count"
        v-model="gamesToLoad"
        type="number"
        name="games-count"
        min="1"
        max="15"
      />
    </label>
    <label
      >chess.com /
      <input
        v-model="ccUsername"
        class="username"
        type="text"
        title="chess.com username"
      />
    </label>
    <label
      >lichess /
      <input
        v-model="liUsername"
        class="username"
        type="text"
        title="lichess.org username"
    /></label>
    <button @click="getInsights">Get!</button>
  </div>
</template>

<style scoped>
.input {
  display: flex;
  font-weight: bold;
  justify-content: center;
  margin: 0px;
}
label {
  margin-right: 5pt;
}
.username {
  max-width: 60pt;
}
#games-count {
  width: 25pt;
}
</style>
