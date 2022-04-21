<script setup props>
// imports

import {onMounted, reactive} from 'vue';
import { Chess } from 'chess.js';

// variables

let board, chess;

const boardID = 'chessBoard' + Math.round(Math.random() * 1000000);

const boardConfig = {
  draggable: true,
  moveSpeed: 'slow',
  snapbackSpeed: 500,
  snapSpeed: 100,
  position: 'start'
}

// vue.js definitions

const props = defineProps({
  game: Object,
  username: String
})

// methods

function getOrientation(chess, username) {
  return chess.header()?.White?.toLowerCase() == username?.toLowerCase() ? 'white' : 'black';
}

// lifecycle hooks

onMounted(() => {
  board = Chessboard(boardID, boardConfig);
  chess = new Chess();
  chess.load_pgn(props.game.pgn);
  board.orientation(getOrientation(chess, props.username));
  board.position(chess.fen());
})

</script>

<style>
  .chess-board {
    width: 460px;
  }
  textarea, input {
    width: 420px;
    margin: 5px;
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
    color: #787878;
  }
  .copyable {
    background: #e3e3e3;
    color: #1f1f1f;
  }
  .opening {
    text-align: left;
  }
</style>

<template>
    <div class="opening">{{ game.opening ? game.opening.eco + ': ' + game.opening.name : ''}}</div>
    <div :id="boardID" class="chess-board">Loading...</div>
    <div class="copyables">
      <div class="pair">
        <label class="name">FEN</label>
        <input class="copyable autoselect analyse__underboard__fen" id="fen">
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
