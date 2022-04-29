<script setup props>
// imports

import {onMounted, reactive, ref} from 'vue';
import { Chess } from 'chess.js';
import { CheguraClient } from '../helpers/chegura-client';
import { LichessClient } from '../helpers/lichess-client';

// constants

const replayInterval = 300;
const maxReplayPlies = 50;
const squareClass = 'square-55d63';

const boardID = 'chessBoard' + Math.round(Math.random() * 1000000);

// variables

let board, $board, chess;

const boardConfig = {
  draggable: true,
  moveSpeed: 200,
  snapbackSpeed: 500,
  snapSpeed: 100,
  position: 'start',
  onMoveEnd,
  onDragStart,
  onDrop,
  onSnapEnd
}

// class instances

const cheguraClient = new CheguraClient({hostname: 'umain-02.cloudapp.net', protocol: 'http', port: 9966});

// vue.js definitions

const props = defineProps({
  game: Object,
  username: String
})

const fen = ref("");
const hint = ref("Let's learn something about this game. Press 'LEARN' when ready");
const bestMove = ref("");

// methods

function getOrientation(chess, username) {
  return chess.header()?.White?.toLowerCase() == username?.toLowerCase() ? 'white' : 'black';
}

const isOurMove = moveData => board.orientation().startsWith(moveData.color);

function highlightMove(aMove) {
  if(!aMove) return;
  let possibleMoves = chess.moves({
    verbose: true
  });
  let moveData = possibleMoves.find(move => move.san == aMove);
  if (moveData && isOurMove(moveData)) {
    $board.find('.' + squareClass).removeClass('highlight')
    $board.find('.square-' + moveData.from).addClass('highlight')
    $board.find('.square-' + moveData.to).addClass('highlight')
  } else {
    $board.find('.' + squareClass).removeClass('highlight');
  }
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (chess.game_over()) return false

  // only pick up pieces for the side to move
  if ((chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = chess.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(chess.fen())
}

function updateStatus () {
  fen.value = chess.fen();
  props.game.pgn = chess.pgn();
  showHints();
}

const getMovesFromPgn = pgn => pgn.replace(/(\[.*\])|(\d+\.\s)|(\n*)/g,'').split(' ').slice(0, -1);

function onMoveEnd () {

}

function showHints() {
  setTimeout(async () => {
    const fenData = await cheguraClient.getFenData(fen.value);
    if(fenData) {
      bestMove.value = {san: fenData.bestMove, score: fenData.sp / 100, depth: fenData.depth};
      highlightMove(fenData.bestMove);
    } else {
      bestMove.value = undefined;
    }
  }, 0);
}

function updateBoard() {
  fen.value = chess.fen();
  board.position(fen.value);
  showHints();
}

function reset() {
  hint.value = '';
  chess.reset();
  updateBoard();
}

function replay() {
  reset();
  const moves = getMovesFromPgn(props.game.pgn);
  showNextMove(moves, 0);
}

function showNextMove(moves, plyNumber) {
  if(plyNumber < moves.length && plyNumber < maxReplayPlies) {
    setTimeout(() => {
      let move = chess.move(moves[plyNumber]);
      updateBoard();
      if(move.san != bestMove.value?.san && isOurMove(move)) {
        setTimeout(() => {
          chess.undo();
          updateBoard();
        }, replayInterval);
      } else {
        showNextMove(moves, ++plyNumber);
      }
    }, replayInterval);
  }
}

// lifecycle hooks

onMounted(() => {
  board = window.Chessboard(boardID, boardConfig);
  $board = window.$(`#${boardID}`);
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
  .highlight {
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
      <div class="best-move-info" v-if="bestMove">
        Best move: <span>{{ bestMove.san }}</span>, score: <span>{{ bestMove.score }}</span>, depth: <span>{{ bestMove.depth }}</span>
      </div>
      <div class="hint">
        {{ hint }}
      </div>
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
