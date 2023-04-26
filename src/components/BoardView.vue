<script setup props>
// imports

import { onMounted, ref } from "vue";
import { Chess } from "chess.js";
import { pgn2moves, formatBest } from "../helpers/converters";
import boardHelper from "../helpers/board-helper";
import GoodMovesView from "./GoodMovesView.vue";
import PopularMovesView from "./PopularMovesView.vue";

// constants

const replayInterval = 300;
const mainLineStudyInterval = 1000;
const mainLineStudyPliesLimit = 10;
const maxReplayPlies = 50;
const targetDepth = 46;
const squareClass = "square-55d63";

const boardID = "chessBoard" + Math.round(Math.random() * 1000000);

// variables

let board, $board, chess, backend;

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

// vue.js definitions

const props = defineProps({
  game: {
    type: Object,
    required: true,
    validator: function (value) {
      return value.pgn != undefined;
    },
  },
  bestMove: {
    type: Object,
    default() {
      return {};
    },
    required: false,
  },
  popularMoves: {
    type: Array,
    default() {
      return [];
    },
    required: false,
  },
  backend: {
    type: Object,
    required: true,
  },
});

const fen = ref("");
const pgn = ref("");
const hint = ref(
  "Let's learn something about this game. Press 'Reply & Learn' when ready"
);
const bestMove = ref(props.bestMove);
const popularMoves = ref(props.popularMoves);
const openingInfo = ref({});

const emit = defineEmits(["replaceWith"]);

// methods

const isOurMove = () => board.orientation().startsWith(chess.turn());

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
  if (moveData) {
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

  updateFen();
  updateMoveInfo();
  updatePgn();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(chess.fen());
}

async function updateMoveInfo() {
  bestMove.value = undefined;
  popularMoves.value = undefined;
  try {
    const data = await backend.getBestMove(fen.value);
    bestMove.value = formatBest(data);
  } catch {
    bestMove.value = null;
  } finally {
    highlightMove(getBestMoveSan(), "best");
    analyze();
  }
  try {
    const popular = await backend.getPopularMoves(fen.value);
    updatePopular(popular);
  } catch {
    popularMoves.value = null;
  } finally {
    highlightMove(getPopularMoveSan(), "popular");
  }
}

const updateFen = () => (fen.value = chess.fen());

const updatePgn = () => (pgn.value = chess.pgn());

// need a sample of the data format
function updatePopular(data) {
  popularMoves.value = data?.moves?.slice(0, 3);
  if (data?.opening) {
    openingInfo.value = data?.opening;
  }
}

function analyze() {
  if (!bestMove.value?.san || bestMove.value.depth < targetDepth) {
    backend.analyze(pgn2moves(pgn.value));
  }
}

async function updateBoard() {
  updateFen();
  await updateMoveInfo();
  board.position(fen.value);
}

async function reset() {
  hint.value = "";
  chess.reset();
  await updateBoard();
}

function showNextMove(moves, plyNumber) {
  if (plyNumber < moves.length && plyNumber < maxReplayPlies) {
    setTimeout(async () => {
      const allGood = (bestMove.value?.alt || []).concat(bestMove.value?.san);
      let move = chess.move(moves[plyNumber]);
      await updateBoard();
      if (!isOurMove() && !allGood.includes(move.san)) {
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

function continueWithMainLine() {
  let mainLineStudyPliesLeft = mainLineStudyPliesLimit;
  studyMainLine(mainLineStudyPliesLeft);
}

function studyMainLine(mainLineStudyPliesLeft) {
  if (mainLineStudyPliesLeft) {
    let moveSan = isOurMove()
      ? getBestMoveSan() || getPopularMoveSan()
      : getPopularMoveSan();
    if (moveSan) {
      setTimeout(async () => {
        chess.move(moveSan);
        await updateBoard();
        updatePgn();
        studyMainLine(mainLineStudyPliesLeft - 1);
      }, mainLineStudyInterval);
    }
  }
}

const getBestMoveSan = () => bestMove.value?.san;
const getPopularMoveSan = () => popularMoves.value?.[0]?.san;

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

function split(moves) {
  const games = boardHelper.getGames(
    pgn.value,
    moves,
    props.game.username,
    board.orientation()
  );
  emit("replaceWith", games);
}

function close() {
  emit("replaceWith", []);
}

function updateAltMoves(altMoves) {
  if (!bestMove.value) bestMove.value = {};
  bestMove.value.alt = altMoves;
  backend.updateAltMoves(fen.value, altMoves);
}

// lifecycle hooks

onMounted(() => {
  backend = props.backend;
  pgn.value = props.game.pgn;
  board = window.Chessboard(boardID, boardConfig);
  $board = window.$(`#${boardID}`);
  chess = new Chess();
  chess.load_pgn(pgn.value);
  board.orientation(
    props.game.orientation ||
      boardHelper.identifyOrientation(chess, props.game.username)
  );
  updateBoard();
});
</script>

<template>
  <div class="board-header">
    <div class="controls">
      <button id="replay" @click="replay">Replay & Learn</button>
      <button id="continue" @click="continueWithMainLine">
        Continue with Main Line
      </button>
    </div>
    <div class="opening">
      {{ openingInfo?.eco ? openingInfo.eco + ": " + openingInfo.name : hint }}
    </div>
  </div>
  <div class="main">
    <div class="main-column">
      <div :id="boardID" class="chess-board">Loading...</div>
    </div>
    <div class="right-column">
      <button id="close" @click="close">x</button>
    </div>
  </div>
  <div class="stats">
    <GoodMovesView :data="bestMove" @update-alt="updateAltMoves" />
    <PopularMovesView :data="popularMoves" @split="split" />
  </div>
  <div class="navigation">
    <button class="control" @click="goBack">&laquo;</button>
    <button class="control" @click="goNext">&raquo;</button>
  </div>
  <div class="copyables">
    <div class="pair">
      <label class="name" for="fen">FEN</label>
      <input
        id="fen"
        class="copyable autoselect analyse__underboard__fen"
        :value="fen"
      />
    </div>
    <div class="pgn">
      <div class="pair">
        <label class="name" for="pgn">PGN</label>
        <textarea
          id="pgn"
          v-model="pgn"
          class="copyable autoselect"
          rows="4"
        ></textarea>
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
  font-size: small;
  margin: 2px;
}
#learn {
  text-align: right;
  text-transform: uppercase;
}
#close {
  height: min-content;
}
.highlight-best {
  box-shadow: inset 0 0 3px 3px greenyellow;
}
.highlight-popular {
  box-shadow: inset 0 0 2px 2px cyan;
}
.control {
  color: #5e5e5e;
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
.chessboard {
  display: block;
}
.main {
  display: flex;
}
.main-column {
  flex: auto;
}
button {
  margin-left: 2px;
  margin-right: 2px;
}
</style>
