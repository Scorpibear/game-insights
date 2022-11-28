<script setup>
import { reactive } from "vue";

import HeaderView from "./components/HeaderView.vue";
import BoardView from "./components/BoardView.vue";

import { BackendCached } from "./helpers/backend-cached";

const state = reactive({
  username: "",
  games: [
    { pgn: "1. e4 c5 2. Nf3 d6 3. Nc3 Nf6 4. d4 cxd4 5. Nxd4 a6 6. ?-?" },
    {
      pgn: "1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5 5. Ng3 Bg6 6. h4 h6 7. Nf3 Nd7 8. h5 ?-?",
    },
    {
      pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. ?-?",
    },
    { pgn: "1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 ?-?" },
  ],
});

const backend = BackendCached.getShared();
</script>

<template>
  <HeaderView
    :backend="backend"
    @games-loaded="
      (games, username) => {
        state.games = games;
        state.username = username;
      }
    "
  />
  <div v-for="game in state.games" :key="game" class="game-view">
    <BoardView :game="game" :username="state.username" :backend="backend" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5pt;
}
.game-view {
  display: inline-block;
  margin: 5pt;
}
</style>
