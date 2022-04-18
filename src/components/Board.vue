<script setup>
import {onMounted, reactive} from 'vue';

defineProps({
  game: Object
})

const boardID = 'chessBoard' + Math.round(Math.random() * 1000000);

// lifecycle hooks
onMounted(() => {
  const board = Chessboard(boardID, 'start');
})

</script>

<style>
  .chess-board {
    width: 600px;
  }
  textarea, input {
    width: 340px;
    margin: 5px;
  }
  textarea {
    height: 360px;
  }
  .copyables .pair {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
}
  .copyables .name {
    flex: 0 0 5ch;
    font-weight: bold;
    color: #787878;
  }
  .copyables .copyable {
    flex: 1 1 auto;
  }
  .copyable {
    background: #e3e3e3;
    color: #1f1f1f;
  }
</style>

<template>
  <div class="chess-board">
    <div :id="boardID" class="chess-board">Loading...</div>
    <div class="copyables">
      <div class="pair">
        <label class="name">FEN</label>
        <input class="copyable autoselect analyse__underboard__fen" id="fen" v-model="game.fen">
      </div>
      <div class="pgn">
        <div class="pair">
          <label class="name">PGN</label>
          <textarea class="copyable autoselect" id="pgn" v-model="game.pgn"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
