<script setup props>
import { formatPopular } from "../helpers/converters";
const props = defineProps({
  data: {
    type: Array,
    default() {
      return undefined;
    },
    required: false,
  },
});

const splitOptions = {3: "Ψ", 5: 5, 7: 7, 11: 11};
const emit = defineEmits(["split2top3", "split2top"]);

function split2top(count) {
  count == 3 ? emit(
    "split2top3",
    props.data.map((item) => item.san),
  ) : emit("split2top", count);
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
    <div v-if="props.data && props.data.length > 1" class="split-area">
    <button
      v-for="(glyph, count) in splitOptions"
      :id="`split2top${count}`"
      :key="count"
      :alt="'split to top ' + count + ' positions'"
      :class="'split-sign' + count"
      @click="split2top(count)"
    >
      {{ glyph }}
    </button>
  </div>
  </div>
</template>
<style scoped>
.split-sign3 {
  transform: rotate(90deg);
  padding: 3px;
}
.popular-move-info {
  height: 20pt;
  font-size: 8pt;
}
.split-area {
  display: inline;
  margin-left: 3px;
}
</style>
