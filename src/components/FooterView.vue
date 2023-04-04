<script setup>
import { version } from "../../package";
import { ref } from "vue";

const appVersion = ref(version);
</script>
<template>
  <footer>
    <a href="https://github.com/Scorpibear/game-insights"
      >Game Insights v{{ appVersion }}</a
    >
  </footer>
</template>
<style>
footer {
  font-size: xx-small;
}
</style>
