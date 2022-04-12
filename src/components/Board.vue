<script setup>
import {onMounted} from 'vue';

//const config = {};


// lifecycle hooks
onMounted(() => {
  const board = Chessboard('chessBoard', 'start');
})

</script>

<style>
  .chess-board {
    align-content: center;
    align-self: center;
    width: 600px;
  }
</style>

<template>
  <div id="chessBoard" class="chess-board">Loading...</div>
  <div id="fen"></div>
  <div id="pgn"></div>
</template>
