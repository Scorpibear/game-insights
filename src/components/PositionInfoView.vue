<script setup props>
import { onMounted, onUpdated, ref } from 'vue';
import NoteManagerSynced from '../backend/note-manager-synced';


const props = defineProps({
  fen: {
    type: String,
    required: true
  },
  pgn: {
    type: String,
    required: true
  },
  noteManager: {
    type: Object,
    required: false,
    default: new NoteManagerSynced()
  }
});

const note = ref('');
const Modes = Object.freeze({fen: Symbol("fen"), pgn: Symbol("pgn"), note: Symbol("note")});
const mode = ref(Modes.pgn);

onMounted(() => {
  setNote();
})

onUpdated(() => {
  setNote();
})

function onNoteInput(e) {
  props.noteManager.set(props.fen, e.target.value);
}

const setNote = () => {
  const loadedNote = props.noteManager.get(props.fen);
  note.value = loadedNote;
}

</script>
<template>
<div class="position-info">
  <div class="controls">
    <button id="show-fen" :class = "(mode == Modes.fen) ? 'selected' : ''" @click="() => {mode = Modes.fen}">FEN</button>
    <button id="show-pgn" :class = "(mode == Modes.pgn) ? 'selected' : ''" @click="() => {mode = Modes.pgn}">PGN</button>
    <button id="show-note" :class = "(mode == Modes.note) ? 'selected' : ''" @click="() => {mode = Modes.note; setNote()}">Notes</button>
  </div>
  <div class="text-area">
      <textarea v-if="mode == Modes.fen" id="fen" :value="props.fen" rows="5" readonly></textarea>
      <textarea v-if="mode == Modes.pgn" id="pgn"  :value="props.pgn" rows="5"></textarea>
      <textarea v-if="mode == Modes.note" id="note" :value="note" rows="5" @input="onNoteInput"></textarea>
  </div>
</div>
</template>
<style scoped>
button {
  min-width: 40pt;
  height: 18pt;
  border-radius: 2pt;
}
textarea {
  font-size: 8pt;
}
.selected {
  font-weight: bold;
}
</style>
