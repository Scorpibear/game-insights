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

const emit = defineEmits(["split"]);

function split() {
  emit(
    "split",
    props.data.map((item) => item.san)
  );
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
      id="split"
      alt="split"
      @click="split"
    >
      Ψ
    </button>
  </div>
</template>
<style scoped>
#split {
  transform: rotate(90deg);
}
</style>
