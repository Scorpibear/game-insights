<script setup>
import { reactive } from 'vue';

import Header from './components/Header.vue';
import Board from './components/Board.vue';


const state = reactive({username: "", games: [
  {pgn: "1. e4 c6 2. Nf3 d5 3. Nc3 ?-?"}, 
  {pgn: "1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 ?-?"}, 
  {pgn: "1. Nf3 d5 2. g3 Nf6 3. Bg2 ?-?"}
  ]});

</script>

<template>
  <Header @games-loaded="(games,username) => { state.games = games; state.username = username }" />
  <div v-for="game in state.games" v-bind:key="game" class="game-view">
    <Board :game="game" :username="state.username"/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
.game-view {
  width: 520px;
  display: inline-block;
  margin: 40px;
}
</style>
