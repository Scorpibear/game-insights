<script setup props>
// imports

import {onMounted, reactive, ref} from 'vue';
import { Chess } from 'chess.js';

// variables

let board, chess;

const replayInterval = 250;
const maxReplayPlies = 18;

let squareClass = 'square-55d63';
let squareToHighlight = null;
let colorToHighlight = null;

const boardID = 'chessBoard' + Math.round(Math.random() * 1000000);

let $board;

const boardConfig = {
  draggable: true,
  moveSpeed: 200,
  snapbackSpeed: 500,
  snapSpeed: 100,
  position: 'start',
  onMoveEnd
}

// vue.js definitions

const props = defineProps({
  game: Object,
  username: String
})

const fen = ref("");
const hint = ref("Let's learn something about this game. Press 'LEARN' when ready");

// methods

function getOrientation(chess, username) {
  return chess.header()?.White?.toLowerCase() == username?.toLowerCase() ? 'white' : 'black';
}

function highlightMove(aMove) {
  if(!aMove) return;
  let possibleMoves = chess.moves({
    verbose: true
  });
  let moveData = possibleMoves.find(move => move.san == aMove);
  if (moveData) {
    if (moveData.color === 'w') {
      $board.find('.' + squareClass).removeClass('highlight-white')
      $board.find('.square-' + moveData.from).addClass('highlight-white')
      squareToHighlight = moveData.to
      colorToHighlight = 'white'
    } else {
      $board.find('.' + squareClass).removeClass('highlight-black')
      $board.find('.square-' + moveData.from).addClass('highlight-black')
      squareToHighlight = moveData.to
      colorToHighlight = 'black'
    }
  }
}

function onMoveEnd () {
  $board.find('.square-' + squareToHighlight)
    .addClass('highlight-' + colorToHighlight)
}

function showHints() {
  setTimeout(async () => {
    const hostname = "umain-02.cloudapp.net:9966";
    const url = `http://${hostname}/api/fendata?fen=${fen.value}`;
    const response = await fetch(url);
    const json = await response.json();
    hint.value = json ? `Best move: ${json.bestMove}, score: ${json.sp / 100} / ${json.depth}` : '';
    highlightMove(json?.bestMove);
  }, 0);
}

function updateBoard() {
  fen.value = chess.fen();
  board.position(fen.value);
  showHints();
}

function replay() {
  chess.reset();
  updateBoard();
  const moves = props.game.moves.split(' ');
  showNextMove(moves, 0);
}

function showNextMove(moves, plyNumber) {
  if(plyNumber < moves.length && plyNumber < maxReplayPlies) {
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
  $board = $(`#${boardID}`);
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
    text-transform: uppercase;
  }
  .hint {
    margin: 2px;
  }
  .highlight-white {
  box-shadow: inset 0 0 3px 3px greenyellow;
  }
  .highlight-black {
    box-shadow: inset 0 0 3px 3px greenyellow;
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
