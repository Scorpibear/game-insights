// App.vue

<script setup>
import { reactive, onMounted } from "vue";

import HeaderView from "./components/HeaderView.vue";
import BoardView from "./components/BoardView.vue";
import FooterView from "./components/FooterView.vue";

import { BackendCached } from "./backend/backend-cached";

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

// Function to parse PGN from URL
function loadGamesFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const pgnParam = urlParams.get("pgn");
  if (pgnParam) {
    try {
      const games = pgnParam.split(";").map((pgn) => ({ pgn: pgn.trim() }));
      state.games = games;
    } catch (error) {
      console.error("Failed to parse PGN from URL:", error);
    }
  }
}

// Load PGN data when the component is mounted
onMounted(() => {
  loadGamesFromUrl();
});
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
  <div v-for="(game, index) in state.games" :id="'board'+index" :key="game" class="game-view">
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
  width: 300pt;
}
</style>
