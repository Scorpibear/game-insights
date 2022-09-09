<script setup props>
// imports

import { onMounted, ref } from "vue";
import { Chess } from "chess.js";
import { BackendCached } from "../helpers/backend-cached";
import { pgn2moves, formatPopular, formatBest } from "../helpers/converters";
import boardHelper from "../helpers/board-helper";

// constants

const replayInterval = 300;
const maxReplayPlies = 50;
const squareClass = "square-55d63";

const boardID = "chessBoard" + Math.round(Math.random() * 1000000);

// variables

let board, $board, chess;

const boardConfig = {
  draggable: true,
  moveSpeed: 200,
  snapbackSpeed: 500,
  snapSpeed: 100,
  position: "start",
  onDragStart,
  onDrop,
  onSnapEnd,
  pieceTheme: "/img/chesspieces/wikipedia/{piece}.png",
};

// class instances

const backend = new BackendCached();

// vue.js definitions

const props = defineProps({
  game: {
    type: Object,
    required: true,
    validator: function (value) {
      return value.pgn != undefined;
    },
  },
  username: {
    type: String,
    required: true,
  },
});

const fen = ref("");
const pgn = ref("");
const hint = ref(
  "Let's learn something about this game. Press 'LEARN' when ready"
);
const bestMove = ref(null);
const popularMoves = ref([]);

// methods

const isOurMove = (moveData) => board.orientation().startsWith(moveData.color);

function highlightMove(aMove, type) {
  if (!$board) {
    return;
  }
  const className = "highlight-" + type;
  if (!aMove) {
    $board.find("." + squareClass).removeClass(className);
    return;
  }
  let possibleMoves = chess.moves({
    verbose: true,
  });
  let moveData = possibleMoves.find((move) => move.san == aMove);
  if (moveData /*&& isOurMove(moveData)*/) {
    $board.find("." + squareClass).removeClass(className);
    $board.find(".square-" + moveData.from).addClass(className);
    $board.find(".square-" + moveData.to).addClass(className);
  } else {
    $board.find("." + squareClass).removeClass(className);
  }
}

function onDragStart(source, piece) {
  // do not pick up pieces if the game is over
  if (chess.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (chess.turn() === "w" && piece.search(/^b/) !== -1) ||
    (chess.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  // see if the move is legal
  var move = chess.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";

  updateMoveInfo();
  updatePgn();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(chess.fen());
}

async function updateMoveInfo() {
  updateFen();
  backend
    .getPopularMoves(fen.value)
    .then(updatePopular)
    .catch(() => (popularMoves.value = []))
    .finally(() => highlightMove(popularMoves.value?.[0]?.san, "popular"));
  await backend
    .getBestMove(fen.value)
    .then((data) => (bestMove.value = formatBest(data)))
    .catch(() => (bestMove.value = undefined))
    .finally(() => highlightMove(bestMove.value?.san, "best"))
    .then(analyze);
}

const updateFen = () => (fen.value = chess.fen());

const updatePgn = () => (pgn.value = chess.pgn());

// need a sample of the data format
function updatePopular(data) {
  popularMoves.value = data?.moves?.slice(0, 3);
}

function analyze() {
  if (!bestMove.value) {
    backend.analyze(pgn2moves(pgn.value));
  }
}

async function updateBoard() {
  updateFen();
  board.position(fen.value);
  await updateMoveInfo();
}

function reset() {
  hint.value = "";
  chess.reset();
  updateBoard();
}

function showNextMove(moves, plyNumber) {
  console.log("showNextMove", moves[plyNumber]);
  if (plyNumber < moves.length && plyNumber < maxReplayPlies) {
    setTimeout(async () => {
      const bestMoveSan = bestMove.value?.san;
      let move = chess.move(moves[plyNumber]);
      await updateBoard();
      if (move.san != bestMoveSan && isOurMove(move)) {
        // to have a chance see the wrong move made before reverting back
        setTimeout(async () => {
          chess.undo();
          await updateBoard();
        }, replayInterval);
      } else {
        showNextMove(moves, ++plyNumber);
      }
    }, replayInterval);
  }
}

// UI event handlers

function replay() {
  reset();
  const moves = pgn2moves(pgn.value);
  showNextMove(moves, 0);
}

const history = [];

function goBack() {
  const move = chess.undo();
  if (move) {
    history.push(move);
    updateBoard();
  }
}

function goNext() {
  const moveObject = history.pop();
  if (chess.move(moveObject)) {
    updateBoard();
  }
}

// lifecycle hooks

onMounted(() => {
  pgn.value = props.game.pgn;
  board = window.Chessboard(boardID, boardConfig);
  $board = window.$(`#${boardID}`);
  chess = new Chess();
  chess.load_pgn(pgn.value);
  board.orientation(boardHelper.identifyOrientation(chess, props.username));
  updateBoard();
});
</script>

<template>
  <div class="board-header">
    <span class="opening">{{
      game.opening ? game.opening.eco + ": " + game.opening.name : ""
    }}</span
    >&nbsp;
    <button id="learn" @click="replay">Learn</button>
    <div class="hint">
      {{ hint }}
    </div>
  </div>
  <div :id="boardID" class="chess-board">Loading...</div>
  <div class="stats">
    <div class="best-move-info">
      Best:
      <span v-if="bestMove" id="best-move-data"
        ><span>{{ bestMove.san }}</span
        >, score: <span>{{ bestMove.score }}</span
        >, depth: <span>{{ bestMove.depth }}</span>
      </span>
      <span v-else> no data </span>
    </div>
    <div class="popular-move-info">
      <span>Popular: </span>
      <span
        v-if="popularMoves && popularMoves.length"
        id="popular-moves-data"
        >{{ formatPopular(popularMoves) }}</span
      >
      <span v-else> no data </span>
    </div>
  </div>
  <div class="navigation">
    <button class="control" @click="goBack">&laquo;</button>
    <button class="control" @click="goNext">&raquo;</button>
  </div>
  <div class="copyables">
    <div class="pair">
      <label class="name">FEN</label>
      <input
        id="fen"
        class="copyable autoselect analyse__underboard__fen"
        :value="fen"
      />
    </div>
    <div class="pgn">
      <div class="pair">
        <label class="name">PGN</label>
        <textarea id="pgn" v-model="pgn" class="copyable autoselect"></textarea>
      </div>
    </div>
  </div>
  <footer></footer>
</template>

<style>
textarea,
input {
  margin-top: 5px;
  margin-right: 0px;
  margin-left: 0px;
  width: 100%;
}
.copyables .pair {
  position: relative;
  display: flex;
  align-content: center;
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
  text-align: left;
}
#learn {
  text-align: right;
  text-transform: uppercase;
}
.hint {
  margin: 2px;
}
.highlight-best {
  box-shadow: inset 0 0 3px 3px greenyellow;
}
.highlight-popular {
  box-shadow: inset 0 0 2px 2px cyan;
}
.control {
  color: #5e5e5e;
  text-transform: uppercase;
  line-height: 1.5;
  margin: 2pt;
}
.square-55d63 {
  touch-action: none;
}
.stats {
  word-wrap: normal;
  width: auto;
  font-size: smaller;
}
</style>
