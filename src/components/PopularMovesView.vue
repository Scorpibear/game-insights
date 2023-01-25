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
  </div>
</template>
