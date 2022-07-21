<script setup>
// imports

import { ref, onMounted } from "vue";

// variables & constants

const lichessUsernameKey = "profile.lichess.username";

// vue.js definitions

const username = ref(localStorage.getItem(lichessUsernameKey) || "");

const emit = defineEmits(["gamesLoaded"]);

// methods

async function getInsights() {
  localStorage.setItem(lichessUsernameKey, username.value);
  await getGames(username.value);
}

function getEndpoint(userID) {
  const gamesToLoad = 3;
  // api reference - https://lichess.org/api#operation/apiGamesUser
  return `https://lichess.org/api/games/user/${userID}?max=${gamesToLoad}&pgnInJson=true&opening=true`;
}

async function getGames(userID) {
  const apiURL = getEndpoint(userID);
  console.log(`calling ${apiURL}`);
  const stream = fetch(apiURL, { headers: { Accept: "application/x-ndjson" } });
  const games = [];
  const onMessage = (game) => {
    games.push(game);
  };
  const onComplete = () => {
    emit("gamesLoaded", games, username.value);
  };

  return stream.then(readStream(onMessage)).then(onComplete);
}

const readStream = (processLine) => (response) => {
  const stream = response.body.getReader();
  const matcher = /\r?\n/;
  const decoder = new TextDecoder();
  let buf = "";

  const loop = () =>
    stream.read().then(({ done, value }) => {
      if (done) {
        if (buf.length > 0) processLine(JSON.parse(buf));
      } else {
        const chunk = decoder.decode(value, {
          stream: true,
        });
        buf += chunk;

        const parts = buf.split(matcher);
        buf = parts.pop();
        for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));
        return loop();
      }
    });

  return loop();
};

// lifecycle hooks

onMounted(() => {});
</script>

<template>
  <h4 class="input">
    <label>Game insights for: </label>
    <input
      id="username"
      v-model="username"
      type="text"
      title="lichess username"
    />
    <button @click="getInsights">Get!</button>
  </h4>
</template>

<style scoped>
.input {
  display: flex;
  justify-content: center;
}
label {
  margin-right: 5pt;
}
#username {
  max-width: 120pt;
  margin: 0px;
}
</style>
