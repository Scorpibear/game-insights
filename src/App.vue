<script setup>
import { reactive } from "vue";

import HeaderView from "./components/HeaderView.vue";
import BoardView from "./components/BoardView.vue";
import FooterView from "./components/FooterView.vue";

import { BackendCached } from "./helpers/backend-cached";

const state = reactive({
  games: [
    { pgn: "1. ?-?" },
    {
      pgn: "1. e4 ?-?",
    },
    {
      pgn: "1. e4 e5 2. ?-?",
    },
    { pgn: "1. d4 ?-?" },
  ],
});

const backend = BackendCached.getShared();
</script>

<template>
  <HeaderView
    :backend="backend"
    @games-loaded="
      (games) => {
        state.games = games;
      }
    "
  />
  <div v-for="(game, index) in state.games" :key="game" class="game-view">
    <BoardView
      :game="game"
      :backend="backend"
      @replace-with="(newGames) => state.games.splice(index, 1, ...newGames)"
    />
  </div>
  <FooterView />
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
