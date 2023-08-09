<script setup props>
import { formatPopular } from "../helpers/converters";
const props = defineProps({
  data: {
    type: Array,
    default() {
      return [];
    },
    required: false,
  },
});

const emit = defineEmits(["split2top3", "split2top18"]);

function split2top3() {
  emit(
    "split2top3",
    props.data.map((item) => item.san),
  );
}

function split2top18() {
  emit("split2top18");
}
</script>
<template>
  <div class="popular-move-info">
    <span>Popular: </span>
    <span v-if="props.data && props.data.length" id="popular-moves-data">{{
      formatPopular(props.data)
    }}</span>
    <span v-else>
      {{ props.data === undefined ? "searching..." : "no data" }}
    </span>
    <button
      v-if="props.data && props.data.length > 1"
      id="split2top3"
      alt="split to top 3 positions"
      class="split-sign"
      @click="split2top3"
    >
      Ψ
    </button>
    <button
      v-if="props.data && props.data.length > 1"
      id="split2top18"
      name="split2top18"
      alt="split to top 18 positions"
      @click="split2top18"
    >
      18
    </button>
  </div>
</template>
<style scoped>
.split-sign {
  transform: rotate(90deg);
  padding: 3px;
}
</style>
