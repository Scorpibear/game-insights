<script setup props>
// imports

import {onMounted, reactive, ref} from 'vue';
import { Chess } from 'chess.js';

// variables

let board, chess, hint;

const replayInterval = 250;

const boardID = 'chessBoard' + Math.round(Math.random() * 1000000);

const boardConfig = {
  draggable: true,
  moveSpeed: 200,
  snapbackSpeed: 500,
  snapSpeed: 100,
  position: 'start'
}

// vue.js definitions

const props = defineProps({
  game: Object,
  username: String
})

const fen = ref("");

// methods

function getOrientation(chess, username) {
  return chess.header()?.White?.toLowerCase() == username?.toLowerCase() ? 'white' : 'black';
}

function updateBoard() {
  fen.value = chess.fen();
  board.position(fen.value);
}

function replay() {
  chess.reset();
  updateBoard();
  const moves = props.game.moves.split(' ');
  showNextMove(moves, 0);
}

function showNextMove(moves, plyNumber) {
  if(plyNumber < moves.length) {
    setTimeout(() => {
      chess.move(moves[plyNumber]);
      updateBoard();
      showNextMove(moves, ++plyNumber);
    }, replayInterval);
  }
}

// lifecycle hooks

onMounted(() => {
  board = Chessboard(boardID, boardConfig);
  chess = new Chess();
  chess.load_pgn(props.game.pgn);
  board.orientation(getOrientation(chess, props.username));
  updateBoard();
})

</script>

<style>
  .chess-board {
    width: 500px;
  }
  textarea, input {
    width: 450px;
    margin-top: 5px;
    margin-right: 0px;
  }
  textarea {
    height: 300px;
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
    font-size: smaller;
    color: #787878;
  }
  .copyable {
    background: #e3e3e3;
    color: #1f1f1f;
  }
  .opening {
    text-align: center;
  }
  #learn {
    text-align: right;
  }
</style>

<template>
    <div class="board-header">
      <span class="opening">{{ game.opening ? game.opening.eco + ': ' + game.opening.name : ''}}</span>&nbsp;
      <button @click="replay" id="learn">Learn</button>
    </div>
    <div :id="boardID" class="chess-board">Loading...</div>
    <div class="copyables">
      <div class="hint">{{ hint }}</div>
      <div class="pair">
        <label class="name">FEN</label>
        <input class="copyable autoselect analyse__underboard__fen" id="fen" :value="fen">
      </div>
      <div class="pgn">
        <div class="pair">
          <label class="name">PGN</label>
          <textarea class="copyable autoselect" id="pgn" v-model="game.pgn"></textarea>
        </div>
      </div>
    </div>
    <footer></footer>
</template>
