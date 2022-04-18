<script setup>
import { reactive } from 'vue';

import Header from './components/Header.vue';
import Board from './components/Board.vue';


const state = reactive({games: [{pgn: "1.e4 e5"}, {pgn: "1.d4 Nf6"}, {pgn: "1.Nf3 d5"}]})

</script>

<template>
  <Header @games-loaded="games => state.games = games" />
  <div v-for="game in state.games" v-bind:key="game">
    <Board :game="game" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
