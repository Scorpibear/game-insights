<script setup>
const emit = defineEmits(["updateAlt"]);

const props = defineProps({
  data: { type: [Object, undefined], required: false, default: undefined },
});

function add() {
  const move = prompt("Alternative move to add");
  let altMoves = props.data?.alt || [];
  altMoves.push(move);
  emit("updateAlt", [...altMoves]);
}

function remove(item) {
  let altMoves = props.data.alt;
  const i = altMoves.indexOf(item);
  if (i > -1) {
    altMoves.splice(i, 1);
  }
  emit("updateAlt", [...altMoves]);
}
</script>

<template>
  <div class="best-move-info" role="text" name="best-move-info">
    Best:
    <span v-if="props.data?.san" id="best-move-data">
      {{ props.data.san }}, score: {{ props.data.score }}, depth:
      {{ props.data.depth }}
    </span>
    <span v-else>
      {{ props.data === undefined ? "searching..." : "no data" }} </span
    >, alt:
    <ul v-if="props.data?.alt">
      <li v-for="item in props.data?.alt" :key="item">
        {{ item }}
        <button @click="remove(item)">x</button>
      </li>
    </ul>
    <button @click="add">+</button>
  </div>
</template>

<style>
ul {
  display: inline;
  margin-left: 0;
  padding-left: 0;
}

li {
  display: inline;
  margin-right: 4px;
}
</style>
